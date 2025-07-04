import athena from "./athenaClient.js";

export const resolvers = () => ({
  Query: {
    totalVentas: async (_p, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          COALESCE(SUM(fv.cantidad * fv.precio_unitario), 0) AS total_ventas
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}')
              AND date('${fechaFin}')
      `;
      console.log("[totalVentas] SQL:", sql);
      // Ejecutamos la query
      const result = await athena.query({ sql });
      console.log("[totalVentas] Athena result:", JSON.stringify(result, null, 2));

      // Asegurémonos de que siempre haya al menos un row
      const items = result.Items || [];
      if (items.length === 0) {
        return 0;
      }

      const row = items[0];
      // Athena-Express puede devolver las claves en mayúsculas,
      // así que checamos varios posibles nombres
      const rawValue =
        row.total_ventas ??
        row.TOTAL_VENTAS ??
        row.total ??
        row.TOTAL ??
        0;

      // Y devolvemos como Float
      return parseFloat(rawValue) || 0;
    },

    totalPedidos: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          COALESCE(COUNT(DISTINCT fv.fk_pedido), 0) AS total_pedidos
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}')
              AND date('${fechaFin}')
      `;
      
      // Ejecutar la query en Athena
      const result = await athena.query({ sql });
      const items = result.Items || [];
      if (items.length === 0) {
        return 0;
      }

      const row = items[0];
      // Athena-Express puede devolver las claves en mayúsculas
      const raw =
        row.total_pedidos ??
        row.TOTAL_PEDIDOS ??
        row.total ??
        row.TOTAL ??
        0;

      return parseInt(raw, 10) || 0;
    },

    clientesNuevos: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          COALESCE(COUNT(*), 0) AS clientes_nuevos
        FROM ${db}.dim_cliente_g4 dc
        JOIN ${db}.dim_tiempo_g4 dt
          ON CAST(dc.fecha_registro AS date) = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}')
              AND date('${fechaFin}')
      `;

      // Ejecuta la consulta en Athena
      const result = await athena.query({ sql });
      const items = result.Items || [];
      if (items.length === 0) {
        return 0;
      }

      const row = items[0];
      // Atenuamos posibles mayúsculas en la clave
      const raw =
        row.clientes_nuevos ??
        row.CLIENTES_NUEVOS ??
        row.count ??
        row.COUNT ??
        0;

      return parseInt(raw, 10) || 0;
    },

    ticketPromedio: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          COALESCE(
            CASE
              WHEN COUNT(DISTINCT fv.fk_pedido)=0 THEN 0
              ELSE SUM(fv.cantidad * fv.precio_unitario)
                   / COUNT(DISTINCT fv.fk_pedido)
            END
          , 0) AS ticket_promedio
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}')
              AND date('${fechaFin}')
      `;

      // Ejecutar la query en Athena
      const result = await athena.query({ sql });
      const items = result.Items || [];
      if (items.length === 0) {
        return 0;
      }

      const row = items[0];
      // Revisar varios posibles nombres de la columna
      const raw =
        row.ticket_promedio ??
        row.TICKET_PROMEDIO ??
        row.ticketpromedio ??
        row.TICKETPROMEDIO ??
        0;

      return parseFloat(raw) || 0;
    },

    pctCumplimiento: async (_parent, { fechaInicio, fechaFin, objetivo  }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          COALESCE(
            CASE
              WHEN ${objetivo } = 0 THEN 0
              ELSE SUM(fv.cantidad * fv.precio_unitario) / ${objetivo } * 100
            END
          , 0) AS pct_cumplimiento
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}')
              AND date('${fechaFin}')
      `;

      // Ejecutar la consulta en Athena
      const result = await athena.query({ sql });
      const items = result.Items || [];
      if (items.length === 0) {
        return 0;
      }

      const row = items[0];
      // Athena-Express puede devolver la clave en mayúsculas o sin guión bajo
      const raw =
        row.pct_cumplimiento ??
        row.PCT_CUMPLIMIENTO ??
        row.pctcumplimiento ??
        row.PCTCUMPLIMIENTO ??
        0;

      // parseFloat para porcentaje
      return parseFloat(raw) || 0;
    },

    paretoCiudades: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          du.ciudad                        AS ciudad,
          COALESCE(SUM(fv.cantidad * fv.precio_unitario), 0) AS total
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.fact_entregas_g4 fe
          ON fe.fk_pedido = fv.fk_pedido
        JOIN ${db}.dim_ubicacion_g4 du
          ON fe.fk_ubicacion = du.id_ubicacion
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE du.ciudad <> 'Lima'
          AND dt.solo_fecha BETWEEN date('${fechaInicio}') AND date('${fechaFin}')
        GROUP BY du.ciudad
        ORDER BY total DESC
      `;

      const result = await athena.query({ sql });
      const items = result.Items || [];

      return items.map(row => {
        // Atenuamos posibles mayúsculas o guiones bajos
        const ciudad = row.ciudad ?? row.CIUDAD ?? "";
        const rawTotal =
          row.total ?? row.TOTAL ?? row["SUM(monto_linea)"] ?? 0;
        const total = parseFloat(rawTotal) || 0;
        return { ciudad, total };
      });
    },

    paretoDistritos: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          du.distrito                      AS distrito,
          COALESCE(SUM(fv.cantidad * fv.precio_unitario), 0) AS total
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.fact_entregas_g4 fe
          ON fe.fk_pedido = fv.fk_pedido
        JOIN ${db}.dim_ubicacion_g4 du
          ON fe.fk_ubicacion = du.id_ubicacion
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE du.ciudad = 'Lima'
          AND dt.solo_fecha BETWEEN date('${fechaInicio}') AND date('${fechaFin}')
        GROUP BY du.distrito
        ORDER BY total DESC
      `;
      const { Items = [] } = await athena.query({ sql });
      return Items.map(row => {
        const distrito = row.distrito ?? row.DISTRITO ?? "";
        const rawTotal = row.total ?? row.TOTAL ?? 0;
        return { distrito, total: parseFloat(rawTotal) || 0 };
      });
    },

    topProductos: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          p.nombre AS producto,
          COALESCE(SUM(fv.cantidad * fv.precio_unitario), 0) AS total_ventas
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.dim_producto_g4 p
          ON fv.fk_producto = p.id_producto
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha BETWEEN date('${fechaInicio}') AND date('${fechaFin}')
        GROUP BY p.nombre
        ORDER BY total_ventas DESC
        LIMIT 10
      `;
      const { Items = [] } = await athena.query({ sql });
      return Items.map(row => {
        const producto = row.producto ?? row.PRODUCTO ?? "";
        const rawTotal =
          row.total_ventas ??
          row.TOTAL_VENTAS ??
          row.total ??
          row.TOTAL ??
          0;
        return { producto, total: parseFloat(rawTotal) || 0 };
      });
    },

    ventasPorDepartamento: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          du.departamento    AS departamento,
          COALESCE(SUM(fv.cantidad * fv.precio_unitario), 0) AS total
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.fact_entregas_g4 fe
          ON fe.fk_pedido = fv.fk_pedido
        JOIN ${db}.dim_ubicacion_g4 du
          ON fe.fk_ubicacion = du.id_ubicacion
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}') AND date('${fechaFin}')
        GROUP BY du.departamento
        ORDER BY total DESC
      `;
      const { Items = [] } = await athena.query({ sql });
      return Items.map(row => {
        const departamento = row.departamento ?? row.DEPARTAMENTO ?? "";
        const rawTotal = row.total ?? row.TOTAL ?? 0;
        return { departamento, total: parseFloat(rawTotal) || 0 };
      });
    },
    evolucionVentas: async (_parent, { fechaInicio, fechaFin }) => {
      const db = process.env.ATHENA_DATABASE;
      const sql = `
        SELECT
          dt.solo_fecha                     AS fecha,
          COALESCE(SUM(fv.cantidad * fv.precio_unitario), 0) AS total_ventas
        FROM ${db}.fact_ventas_lineas_g4 fv
        JOIN ${db}.dim_tiempo_g4 dt
          ON fv.fk_fecha_pedido_keyfecha = dt.solo_fecha
        WHERE dt.solo_fecha
          BETWEEN date('${fechaInicio}') AND date('${fechaFin}')
        GROUP BY dt.solo_fecha
        ORDER BY dt.solo_fecha
      `;

      const { Items = [] } = await athena.query({ sql });
      return Items.map(row => {
        // Obtenemos el string de fecha
        const fecha = row.fecha ?? row.FECHA ?? "";
        // Obtenemos el total de ventas
        const rawTotal =
          row.total_ventas ??
          row.TOTAL_VENTAS ??
          row.total ??
          row.TOTAL ??
          0;
        return {
          fecha,
          totalVentas: parseFloat(rawTotal) || 0
        };
      });
    }
    // Aplica la misma lógica defensiva en los demás resolvers...
  }
});
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type CitySales {
    ciudad: String!
    total: Float!
  }

  type DistrictSales {
    distrito: String!
    total: Float!
  }

  type ProductSales {
    producto: String!
    total: Float!
  }

  type DepartmentSales {
    departamento: String!
    total: Float!
  }

  type TimeSales {
    fecha: String!      # "YYYY-MM-DD"
    totalVentas: Float!
  }

  type Query {
    totalVentas(fechaInicio: String!, fechaFin: String!): Float!
    totalPedidos(fechaInicio: String!, fechaFin: String!): Int!
    ticketPromedio(fechaInicio: String!, fechaFin: String!): Float!
    clientesNuevos(fechaInicio: String!, fechaFin: String!): Int!
    pctCumplimiento(
      fechaInicio: String!,
      fechaFin: String!,
      objetivo: Float!
    ): Float!
    paretoCiudades(fechaInicio: String!, fechaFin: String!): [CitySales!]!
    paretoDistritos(fechaInicio: String!, fechaFin: String!): [DistrictSales!]!
    topProductos(fechaInicio: String!, fechaFin: String!): [ProductSales!]!
    ventasPorDepartamento(fechaInicio: String!, fechaFin: String!): [DepartmentSales!]!
    evolucionVentas(fechaInicio: String!, fechaFin: String!): [TimeSales!]!
  }
`;

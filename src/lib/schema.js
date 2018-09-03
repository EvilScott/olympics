const { gql } = require('apollo-server-express'),
  { Pool } = require('pg');

const pool = new Pool({ host: 'db', user: 'scott', database: 'olympics' });

const typeDefs = gql`
type Query {
  athlete(id: ID!): Athlete
}

type Athlete {
  name: String
  sex: String
}
`;

const resolvers = {
  Query: {
    async athlete(obj, { id }) {
      let res;
      const conn = await pool.connect();
      try {
        res = await conn.query('SELECT * FROM athletes WHERE id = $1', [id]);
      } finally {
        conn.release();
      }
      return res.rows[0];
    }
  },

  Athlete: {
    name({ name }) {
      return name;
    },
    sex({ sex }) {
      return sex;
    }
  }
};

module.exports = { typeDefs, resolvers };

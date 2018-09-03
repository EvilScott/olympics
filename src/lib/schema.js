const { gql } = require('apollo-server-express'),
  { Pool } = require('pg');

const pool = new Pool({ host: 'db', user: 'scott', database: 'olympics' });

const find = async (sql, ...args) => {
  let res;
  const conn = await pool.connect();
  try {
    res = await conn.query(sql, args);
  } finally {
    conn.release();
  }
  return res.rows;
};

const findOne = async (sql, args) => {
  const rows = await find(sql, args);
  return rows[0];
};


const typeDefs = gql`
type Query {
  athlete(id: ID!): Athlete
}

type Athlete {
  name: String!
  sex: String!
  results: [Result]!
}

type Result {
  age: Int!
  height: Int
  weight: Int
  country: Country!
  event: Event!
  games: Games!
  medal: Medal
}

type Country {
  short_name: String!
}

type Event {
  name: String!
  sport: String!
}

type Games {
  year: Int!
  season: Season!
  venue: String!
}

enum Season {
  Summer
  Winter
}

enum Medal {
  Bronze
  Silver
  Gold
}
`;

const resolvers = {
  Query: {
    async athlete(obj, { id }) {
      return await findOne('SELECT * FROM athletes WHERE id = $1', id);
    }
  },

  Athlete: {
    results: async ({ id }) => await find('SELECT * FROM results WHERE athelete_id = $1', id)
  },

  Result: {
    games: async ({ games_id }) => {
      const sql = 'SELECT year, season, venues.city as venue FROM games ' +
        'JOIN venues ON (games.venue_id = venues.id) WHERE games.id = $1';
      return await findOne(sql, games_id)
    },
    country: async ({ country_id }) => await findOne('SELECT * FROM countries WHERE id = $1', country_id),
    event: async ({ event_id }) => {
      const sql = 'SELECT events.event AS name, sports.sport FROM events ' +
        'JOIN sports ON (events.sport_id = sports.id) WHERE events.id = $1';
      return await findOne(sql, event_id);
    }
  }
};

module.exports = { typeDefs, resolvers };

/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    models: {
      connection: 'pgService'
    },

    connections: {
          pgService: {
              adapter: 'sails-postgresql'
          },
          //see dev-dependencies.sh (Database section for installing DB/ Configuring PostgreSQL)
          pgLocal: {
            adapter: 'sails-postgresql',
            database: 'fpds_demo',
            host: 'localhost',
            user: 'postgres',
            password: 'postgres',
            port: 5432,
            //poolSize: 10,
            //ssl: false 
          }
    }
};

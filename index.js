import sql from 'mssql';
import 'dotenv/config';

// Configuration for your SQL Server
const config = {
  user: process.env.MSSQL_USER,
  password: process.env.MSSQL_PASSWORD,
  server: process.env.MSSQL_SERVER, // You can also use an IP address
  database: 'master', // Connect to the master database to manage other databases
  port: parseInt(process.env.MSSQL_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: false, // Change this based on your server configuration
  },
};

// Function to drop all databases
async function dropAllDatabases() {
  try {
    // Connect to the SQL Server
    await sql.connect(config);

    // Query to get a list of all user databases (excluding system databases)
    const query = `
      SELECT name
      FROM sys.databases
      WHERE database_id > 4;`;

    const result = await sql.query(query);

    // Loop through the list of databases and drop them
    for (const row of result.recordset) {
      const dbName = row.name;
      console.log(`Dropping database: ${dbName}`);

      // Drop the database
      await sql.query(`alter database [${dbName}] set single_user with rollback immediate;DROP DATABASE [${dbName}]`);
      console.log(`Database ${dbName} dropped.`);
    }

    console.log('All databases dropped successfully.');
  } catch (err) {
    console.error('Error dropping databases:', err);
  } finally {
    // Close the SQL Server connection
    await sql.close();
  }
}

// Call the function to drop all databases
dropAllDatabases();

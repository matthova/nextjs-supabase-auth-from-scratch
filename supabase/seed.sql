DO
$do$
BEGIN
   IF EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'rls_client') THEN

      RAISE NOTICE 'Role "rls_client" already exists. Skipping.';
   ELSE
      CREATE USER rls_client
      WITH
        LOGIN PASSWORD 'postgres';

      GRANT anon TO rls_client;

      GRANT authenticated TO rls_client;
   END IF;
END
$do$;

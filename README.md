# roll-call
Mandatory 2 for class Development of large systems

# E2E tests 
1. Before you run your e2e tests, you need to insert data to rollcall_test db using the `insert_e2e` MySQL script
2. Then you run the api in test env using the command: `npm run start-e2e`
3. When you are done with e2e testing, you need to run the `truncate_e2e` MySQL script to wipe all data from the db.

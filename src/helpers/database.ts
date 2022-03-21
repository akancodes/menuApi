const { connect } = require("mongoose");

export default async function connectToDatabase(
  username: string,
  password: string,
  database: string
) {
  await connect(
    `mongodb+srv://${username}:${password}@cluster0.fnq32.mongodb.net/${database}?retryWrites=true&w=majority`
  );
}

import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// TODO: Establish database connection before starting the server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

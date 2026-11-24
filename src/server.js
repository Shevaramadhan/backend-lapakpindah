import { app } from './app.js';
import { config } from './config/env.js';

// 0.0.0.0 agar HP di jaringan Wi-Fi yang sama bisa mengakses server laptop.
app.listen(config.port, '0.0.0.0', () => {
  console.log(`LapakPindah API berjalan di http://localhost:${config.port}`);
});

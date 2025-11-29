import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';

/**
 * Seed script para popular a biblioteca de exercícios
 * Exercícios populares com URLs de GIFs demonstrativos
 */

const exercises = [
  // PEITO
  {
    name: "Supino Reto com Barra",
    muscleGroup: "Peito",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/5FZW8Qj.gif",
    mediaType: "gif",
    description: "Deite no banco reto, pegue a barra com pegada média, desça até o peito e empurre para cima.",
    isGlobal: 1
  },
  {
    name: "Supino Inclinado com Halteres",
    muscleGroup: "Peito",
    equipment: "Halteres",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/XqKqJ5L.gif",
    mediaType: "gif",
    description: "No banco inclinado (30-45°), empurre os halteres para cima mantendo controle.",
    isGlobal: 1
  },
  {
    name: "Crucifixo com Halteres",
    muscleGroup: "Peito",
    equipment: "Halteres",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/8vqKjZL.gif",
    mediaType: "gif",
    description: "Abra os braços lateralmente com leve flexão nos cotovelos, depois junte na frente.",
    isGlobal: 1
  },
  {
    name: "Flexão de Braço",
    muscleGroup: "Peito",
    equipment: "Peso Corporal",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/yKzJ8Qj.gif",
    mediaType: "gif",
    description: "Posição de prancha, desça o corpo até quase tocar o chão e empurre para cima.",
    isGlobal: 1
  },

  // COSTAS
  {
    name: "Barra Fixa",
    muscleGroup: "Costas",
    equipment: "Barra Fixa",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/3vqKjZL.gif",
    mediaType: "gif",
    description: "Segure a barra com pegada pronada, puxe o corpo até o queixo passar a barra.",
    isGlobal: 1
  },
  {
    name: "Remada Curvada com Barra",
    muscleGroup: "Costas",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/7vqKjZL.gif",
    mediaType: "gif",
    description: "Incline o tronco, puxe a barra até o abdômen mantendo as costas retas.",
    isGlobal: 1
  },
  {
    name: "Pulldown",
    muscleGroup: "Costas",
    equipment: "Máquina",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/9vqKjZL.gif",
    mediaType: "gif",
    description: "Puxe a barra até a altura do peito, contraia as escápulas.",
    isGlobal: 1
  },
  {
    name: "Remada Unilateral com Halter",
    muscleGroup: "Costas",
    equipment: "Halteres",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/1vqKjZL.gif",
    mediaType: "gif",
    description: "Apoie um joelho no banco, puxe o halter até a lateral do tronco.",
    isGlobal: 1
  },

  // PERNAS
  {
    name: "Agachamento Livre",
    muscleGroup: "Pernas",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/2vqKjZL.gif",
    mediaType: "gif",
    description: "Barra nas costas, desça até as coxas ficarem paralelas ao chão.",
    isGlobal: 1
  },
  {
    name: "Leg Press 45°",
    muscleGroup: "Pernas",
    equipment: "Máquina",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/4vqKjZL.gif",
    mediaType: "gif",
    description: "Empurre a plataforma com os pés na largura dos ombros.",
    isGlobal: 1
  },
  {
    name: "Stiff",
    muscleGroup: "Pernas",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/6vqKjZL.gif",
    mediaType: "gif",
    description: "Pernas levemente flexionadas, desça a barra mantendo as costas retas.",
    isGlobal: 1
  },
  {
    name: "Cadeira Extensora",
    muscleGroup: "Pernas",
    equipment: "Máquina",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/0vqKjZL.gif",
    mediaType: "gif",
    description: "Estenda as pernas até ficarem retas, contraia o quadríceps.",
    isGlobal: 1
  },
  {
    name: "Cadeira Flexora",
    muscleGroup: "Pernas",
    equipment: "Máquina",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/5vqKjZM.gif",
    mediaType: "gif",
    description: "Flexione as pernas trazendo os calcanhares em direção aos glúteos.",
    isGlobal: 1
  },

  // OMBROS
  {
    name: "Desenvolvimento com Barra",
    muscleGroup: "Ombros",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/XvqKjZL.gif",
    mediaType: "gif",
    description: "Empurre a barra acima da cabeça partindo dos ombros.",
    isGlobal: 1
  },
  {
    name: "Elevação Lateral com Halteres",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/YvqKjZL.gif",
    mediaType: "gif",
    description: "Eleve os halteres lateralmente até a altura dos ombros.",
    isGlobal: 1
  },
  {
    name: "Elevação Frontal com Halteres",
    muscleGroup: "Ombros",
    equipment: "Halteres",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/ZvqKjZL.gif",
    mediaType: "gif",
    description: "Eleve os halteres à frente até a altura dos ombros.",
    isGlobal: 1
  },
  {
    name: "Remada Alta",
    muscleGroup: "Ombros",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/WvqKjZL.gif",
    mediaType: "gif",
    description: "Puxe a barra até a altura do queixo com pegada fechada.",
    isGlobal: 1
  },

  // BÍCEPS
  {
    name: "Rosca Direta com Barra",
    muscleGroup: "Bíceps",
    equipment: "Barra",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/VvqKjZL.gif",
    mediaType: "gif",
    description: "Flexione os cotovelos trazendo a barra até os ombros.",
    isGlobal: 1
  },
  {
    name: "Rosca Alternada com Halteres",
    muscleGroup: "Bíceps",
    equipment: "Halteres",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/UvqKjZL.gif",
    mediaType: "gif",
    description: "Alterne a flexão dos braços, um de cada vez.",
    isGlobal: 1
  },
  {
    name: "Rosca Martelo",
    muscleGroup: "Bíceps",
    equipment: "Halteres",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/TvqKjZL.gif",
    mediaType: "gif",
    description: "Flexione os cotovelos mantendo as palmas voltadas uma para a outra.",
    isGlobal: 1
  },
  {
    name: "Rosca Scott",
    muscleGroup: "Bíceps",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/SvqKjZL.gif",
    mediaType: "gif",
    description: "Apoie os braços no banco Scott e flexione os cotovelos.",
    isGlobal: 1
  },

  // TRÍCEPS
  {
    name: "Tríceps Testa com Barra",
    muscleGroup: "Tríceps",
    equipment: "Barra",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/RvqKjZL.gif",
    mediaType: "gif",
    description: "Deitado, desça a barra até próximo da testa e estenda os braços.",
    isGlobal: 1
  },
  {
    name: "Tríceps Pulley",
    muscleGroup: "Tríceps",
    equipment: "Máquina",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/QvqKjZL.gif",
    mediaType: "gif",
    description: "Empurre a barra para baixo até os braços ficarem estendidos.",
    isGlobal: 1
  },
  {
    name: "Tríceps Francês com Halteres",
    muscleGroup: "Tríceps",
    equipment: "Halteres",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/PvqKjZL.gif",
    mediaType: "gif",
    description: "Sentado, desça o halter atrás da cabeça e estenda os braços.",
    isGlobal: 1
  },
  {
    name: "Mergulho em Paralelas",
    muscleGroup: "Tríceps",
    equipment: "Paralelas",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/OvqKjZL.gif",
    mediaType: "gif",
    description: "Desça o corpo flexionando os cotovelos e empurre para cima.",
    isGlobal: 1
  },

  // ABDÔMEN
  {
    name: "Abdominal Reto",
    muscleGroup: "Abdômen",
    equipment: "Peso Corporal",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/NvqKjZL.gif",
    mediaType: "gif",
    description: "Deitado, flexione o tronco em direção aos joelhos.",
    isGlobal: 1
  },
  {
    name: "Prancha Isométrica",
    muscleGroup: "Abdômen",
    equipment: "Peso Corporal",
    difficulty: "iniciante",
    mediaUrl: "https://i.imgur.com/MvqKjZL.gif",
    mediaType: "gif",
    description: "Mantenha o corpo reto apoiado nos antebraços e pés.",
    isGlobal: 1
  },
  {
    name: "Abdominal Bicicleta",
    muscleGroup: "Abdômen",
    equipment: "Peso Corporal",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/LvqKjZL.gif",
    mediaType: "gif",
    description: "Alterne cotovelo com joelho oposto em movimento de bicicleta.",
    isGlobal: 1
  },
  {
    name: "Elevação de Pernas",
    muscleGroup: "Abdômen",
    equipment: "Peso Corporal",
    difficulty: "intermediario",
    mediaUrl: "https://i.imgur.com/KvqKjZL.gif",
    mediaType: "gif",
    description: "Deitado, eleve as pernas até ficarem perpendiculares ao chão.",
    isGlobal: 1
  },
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'treino_app',
  });

  const db = drizzle(connection, { schema, mode: 'default' });

  console.log('🌱 Seeding exercise library...');

  for (const exercise of exercises) {
    await connection.execute(
      `INSERT INTO exerciseLibrary (name, muscleGroup, equipment, difficulty, mediaUrl, mediaType, description, isGlobal) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = name`,
      [
        exercise.name,
        exercise.muscleGroup,
        exercise.equipment,
        exercise.difficulty,
        exercise.mediaUrl,
        exercise.mediaType,
        exercise.description,
        exercise.isGlobal
      ]
    );
  }

  console.log(`✅ Seeded ${exercises.length} exercises successfully!`);
  await connection.end();
}

seed().catch(console.error);

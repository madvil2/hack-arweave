import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';

// Mock data for leaderboard; replace with actual data fetching logic
const mockLeaderboardData = [
  { player: 'madvil2', time: '0:15', deaths: 115 },
  { player: 'owl', time: '3:12', deaths: 2 },
  { player: 'navalkrinzha', time: '2:50', deaths: 4 },
  { player: 'SpeedyGonzales', time: '1:20', deaths: 5 },
  { player: 'ShadowHunter', time: '2:05', deaths: 8 },
  { player: 'LightningBolt', time: '1:45', deaths: 3 },
  { player: 'NinjaWarrior', time: '2:30', deaths: 12 },
  { player: 'PixelMaster', time: '3:00', deaths: 7 },
  { player: 'GamerGuy', time: '2:25', deaths: 9 },
  { player: 'QueenBee', time: '1:55', deaths: 4 },
  { player: 'DragonSlayer', time: '2:10', deaths: 6 },
  { player: 'MysticMage', time: '2:40', deaths: 10 },
  { player: 'CosmicKnight', time: '3:05', deaths: 3 },
  { player: 'StealthyFox', time: '2:15', deaths: 5 },
  { player: 'BlazingInferno', time: '1:50', deaths: 8 },
  { player: 'EpicHero', time: '3:25', deaths: 6 },
  { player: 'MightyThor', time: '2:35', deaths: 11 },
  { player: 'GalacticRider', time: '1:40', deaths: 7 },
  { player: 'TitaniumTitan', time: '3:10', deaths: 9 },
  { player: 'WickedWizard', time: '2:00', deaths: 2 },
  { player: 'SavageSamurai', time: '1:30', deaths: 4 },
  { player: 'FearlessKnight', time: '3:20', deaths: 10 },
  { player: 'BoldBeast', time: '2:20', deaths: 3 },
];

// Mock data for personal stats; replace with actual data fetching logic
const mockPersonalStats = {
  player: 'madvil2',
  time: '0:15',
  deaths: 115,
  chunks: [
    { level: 1, time: '0:05', deaths: 50 },
    { level: 2, time: '0:07', deaths: 40 },
    { level: 3, time: '0:03', deaths: 25 },
  ],
  obstacles: 150,
  additionalData: 'Any other data about the player...',
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(mockLeaderboardData);
  const [personalStats, setPersonalStats] = useState(mockPersonalStats);

  useEffect(() => {
    // Replace this with actual data fetching logic
    setLeaderboard(mockLeaderboardData);
    setPersonalStats(mockPersonalStats);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Leaderboard</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Player</th>
            <th>Time</th>
            <th>Deaths</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index}>
              <td>{entry.player}</td>
              <td>{entry.time}</td>
              <td>{entry.deaths}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.subheading}>Personal Stats</h2>
      <div className={styles.personalStats}>
        <p><strong>Player:</strong> {personalStats.player}</p>
        <p><strong>Total Time:</strong> {personalStats.time}</p>
        <p><strong>Total Deaths:</strong> {personalStats.deaths}</p>
        <p><strong>Total Obstacles:</strong> {personalStats.obstacles}</p>
        <p><strong>Additional Data:</strong> {personalStats.additionalData}</p>

        <h3 className={styles.subheading}>Chunks</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Level</th>
              <th>Time</th>
              <th>Deaths</th>
            </tr>
          </thead>
          <tbody>
            {personalStats.chunks.map((chunk, index) => (
              <tr key={index}>
                <td>{chunk.level}</td>
                <td>{chunk.time}</td>
                <td>{chunk.deaths}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;

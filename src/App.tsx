import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ConnectButton, useConnection } from "arweave-wallet-kit";
import GamePage from './pages/GamePage/GamePage';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import { ArConnect } from 'arweavekit/auth';
import styles from './App.module.scss';
import Game from './pages/Game/Game';
import Edit from './pages/Edit/Edit';

function App() {
    const [isInstalled, setIsInstalled] = useState(false);
    const { connected } = useConnection();

    useEffect(() => {
        const checkInstallation = async () => {
            const response = await ArConnect.isInstalled();
            setIsInstalled(response);
        };
        checkInstallation();
    }, []);

    useEffect(() => {
        console.log("Connection changed");
    }, [connected]);

    return (
        <Router>
            <div id="app">
                <div className={styles.wrap}>
                    <header className={styles.header}>
                        <h1>BlockRun</h1>
                        <nav>
                            <Link to="/">Home</Link>
                            <Link to="/leaderboard">Leaderboard</Link>
                            <Link to="/game">Game</Link>
                            <Link to="/edit">Edit</Link>
                        </nav>
                        <ConnectButton
                            accent="rgb(186,85,211)"
                            profileModal={true}
                            showBalance={true}
                        />
                    </header>
                    {isInstalled ? (
                        connected ? (
                            <Routes>
                                <Route path="/" element={<GamePage />} />
                                <Route path="/leaderboard" element={<Leaderboard />} />
                                <Route path="/game" element={<Game />} />
                                <Route path="/edit" element={<Edit />} />
                            </Routes>
                        ) : (
                            <></>
                        )
                    ) : (
                        <div>
                            <p>ArConnect extension is not installed. Please install it from <a href="https://www.arconnect.io/download" target="_blank" rel="noopener noreferrer">here</a>.</p>
                        </div>
                    )}
                </div>
            </div>
        </Router>
    );
}

export default App;

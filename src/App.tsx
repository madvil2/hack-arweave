import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ConnectButton, useConnection } from "arweave-wallet-kit";
import EditPage from './pages/EditPage/EditPage';
import Leaderboard from './pages/Leaderboard/Leaderboard';
import { ArConnect } from 'arweavekit/auth';
import styles from './App.module.scss';
import Game from './pages/Game/Game';

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
            <div>
                <div className={styles.wrap}>
                    <header className={styles.header}>
                        <h1>LockBlock</h1>
                        <nav>
                            <Link to="/">Home</Link>
                            <Link to="/stats">Statistics</Link>
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
                                <Route path="/" element={<Game />} />
                                <Route path="/stats" element={<Leaderboard />} />
                                <Route path="/edit" element={<EditPage />} />
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

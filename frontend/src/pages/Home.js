import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="home">
            <h1>Benvenuto nel MERN Blueprint</h1>
            <p>Un'applicazione CRUD completa costruita con lo stack MERN</p>

            <div className="features">
                <h2>Caratteristiche</h2>
                <ul>
                    <li>Autenticazione utente completa</li>
                    <li>Gestione degli elementi</li>
                    <li>Design responsive</li>
                    <li>Validazione dei form</li>
                </ul>
            </div>

            <div className="cta-buttons">
                {!user ? (
                    <>
                        <Link to="/login" className="btn btn-primary">Accedi</Link>
                        <Link to="/register" className="btn btn-secondary">Registrati</Link>
                    </>
                ) : (
                    <Link to="/items" className="btn btn-primary">Gestisci Items</Link>
                )}
            </div>
        </div>
    );
}

export default Home;
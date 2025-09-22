'use client';
import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold text-primary fs-3 me-3" href="/">
                    HABITA
                </Link>

                {/* Boutons légèrement à gauche */}
                <div className="d-flex nav-buttons gap-3">
                    <Link href="/login" className="btn btn-outline-primary fw-bold">
                        Connexion
                    </Link>
                    <Link href="/register" className="btn btn-primary fw-bold">
                        Inscription
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;

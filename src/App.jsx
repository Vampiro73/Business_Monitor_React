import React, { useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Chart, registerables } from 'chart.js';
// 1. Importa tus iconos (reemplaza 'go_icono.png' y 'ok_icono.png' con los nombres exactos)
const iconoGo = "images/go.png";
const iconoOk = "images /check.png";

Chart.register(...registerables);

function App() {
    const mapRef = useRef(null);
    const chartsRef = useRef([]);

    useEffect(() => {
        // Destruir gráficas previas para evitar duplicidad
        chartsRef.current.forEach(c => c.destroy());
        chartsRef.current = [];

        // --- 1. MAPA (Tu lógica exacta de script.js) ---
        if (!mapRef.current) {
            const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([19.4319, -99.2132], 14);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);
            L.marker([19.4319, -99.2132]).addTo(map).bindPopup('Corporativo Montes Urales').openPopup();
            mapRef.current = map;
            setTimeout(() => { map.invalidateSize(); }, 500);
        }

        // --- 2. GRÁFICAS (Tus datos literales de script.js) ---
        const addChart = (id, config) => {
            const el = document.getElementById(id);
            if (el) chartsRef.current.push(new Chart(el, config));
        };

        // Onboarding Lineal con ejes Blancos
        addChart('lineChart', {
            type: 'line',
            data: {
                labels: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],
                datasets: [{
                    data: [12, 18, 48, 42, 78, 68, 88, 62, 42],
                    borderColor: '#00e5ff',
                    backgroundColor: 'rgba(0, 229, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ffffff', // <-- Esto pone el texto de las horas en blanco
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)', // Líneas de la rejilla muy sutiles
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff', // <-- Esto pone los números laterales en blanco
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    }
                }
            }
        });

        // Donut Chart
        addChart('donutChart', {
            type: 'doughnut',
            data: {
                labels: ['App Móvil', 'Portal Web', 'Sucursal'],
                datasets: [{ data: [45, 30, 25], backgroundColor: ['#5103e1', '#7700d8', '#009dff'], borderWidth: 0 }]
            },
            options: { maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#fff' } } } }
        });

        // Bar Chart CORREGIDO (Textos Blancos)
        addChart('barChart', {
            type: 'bar',
            data: {
                labels: ['Urales', 'Monterrey', 'Guadalajara', 'Queretaro', 'Puebla', 'Otros'],
                datasets: [{
                    data: [1200, 950, 700, 450, 250, 120],
                    backgroundColor: ['#0400ff', '#aa00ff', '#058fff', '#db11af', '#132bff', '#6c757d'],
                    borderRadius: 5 // Un pequeño redondeado para que se vea más moderno
                }]
            },
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#ffffff', // Texto de montos en blanco
                            font: { size: 10 }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: '#ffffff', // Nombres de sucursales en blanco
                            font: { size: 10 }
                        },
                        grid: {
                            display: false, // Quitamos líneas verticales para que se vea más limpio
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }, []);

    return (
        <div className="theme-dark">
            <header className="main-header">
                <nav className="navbar navbar-expand-lg navbar-dark w-100 p-0">
                    <div className="container-fluid">
                        <div className="header-left d-flex align-items-center">
                            <img src="images/logo header.png" className="header-logo" alt="Actinver" />
                            <div className="divider-v"></div>
                            <span className="header-monitor-text">Business Monitor</span>
                        </div>
                        <div className="header-right d-flex align-items-center ms-auto">
                            <div className="text-end me-3">
                                <div className="user-name">Roberto García</div>
                                <div className="user-session">CERRAR SESIÓN</div>
                            </div>
                            <img src="images/avatar.png" className="rounded-circle border border-secondary" width="40" height="40" />
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container-fluid p-3">
                <div className="row g-3 mb-3">
                    <div className="col-md-2">
                        <div className="card-custom">
                            <div className="card-title text-center">&lt; Febrero &gt;</div>
                            {/* Grid de calendario con tus estilos */}
                            <div className="calendar-grid">
                                {[...Array(28)].map((_, i) => (
                                    <div key={i} className={`calendar-day ${i + 1 === 17 ? 'today' : ''}`}>{i + 1}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="card-custom">
                            <div className="card-title">Onboarding Clientes por hora</div>
                            <div style={{ height: '200px' }}><canvas id="lineChart"></canvas></div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-custom">
                            <div className="card-title text-center">Onboarding por Canal</div>
                            <div style={{ height: '200px' }}><canvas id="donutChart"></canvas></div>
                        </div>
                    </div>
                </div>

                <div className="row g-3 mb-3">
                    <div className="col-md-2">
                        <div className="card-custom card-reduced" style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className="card-title">Asistente IA</div>
                            <textarea className="asistente-input" placeholder="Escribe tu mensaje..."></textarea>
                            <div className="d-flex justify-content-between mt-2">
                                <button className="btn btn-sm btn-outline-info">Voz</button>
                                <button className="btn btn-sm btn-info">Enviar</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7">
                        <div className="row g-3 h-100">
                            <div className="col-md-6">
                                <div className="card-custom card-reduced">
                                    <div className="card-title">Top 10 Sucursales</div>
                                    <div className="sucursal-scroll-list" style={{ height: '180px', overflowY: 'auto' }}>
                                        {[...Array(10)].map((_, i) => (
                                            <div key={i} className="sucursal-item">
                                                <span>{i + 1}. Sucursal Montes Urales</span>
                                                <span className="suc-val">3,450</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div id="map" style={{ height: '100%', minHeight: '230px', borderRadius: '15px' }}></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-custom card-reduced">
                            <div className="card-title">Saldo en la cuenta</div>
                            <div style={{ height: '200px' }}><canvas id="barChart"></canvas></div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="card-custom-2">
                            <div className="card-title" style={{ color: '#00e5ff' }}>Spine Funnel Comercial</div>
                            <div className="funnel-container">
                                {['Captación', 'Activación', 'Diagnóstico', 'Propuesta', 'Cierre', 'Posventa'].map((step, i) => {
                                    // Definimos los números exactos de tu imagen
                                    const numbers = [1240, 1090, 940, 790, 690, 560];

                                    return (
                                        <div key={i} className={`funnel-step ${i >= 4 ? 'completed' : ''}`}>
                                            <div className="funnel-label">{i + 1}. {step}</div>

                                            {/* Contenedor para alinear número e imagen */}
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                                <div className="funnel-number">{numbers[i]}</div>

                                                {/* Solo mostramos imagen en los pasos 5 (Cierre) y 6 (Posventa) */}
                                                {i === 4 && <img src={"images/go.png"} alt="ok" style={{ width: '35px', height: 'auto' }} />}
                                                {i === 5 && <img src={"images/check.png"} alt="go" style={{ width: '35px', height: 'auto' }} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
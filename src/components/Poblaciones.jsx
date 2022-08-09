import { IonList, IonSelect, IonSelectOption, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonItem} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import {Chart, registerables } from 'chart.js';
import {Bar, Pie } from 'react-chartjs-2';
import './Poblaciones.css';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);

const Poblaciones = () => {

    const sexoOpciones = [
        {
            value: 1,
            label: "Ambos"
        },
        {
            value: 2,
            label: "Hombres"
        },
        {
            value: 3,
            label: "Mujeres"
        }
    ];

    var graficoOpciones = [
        {
            value: 1,
            label: "Barras",
            type: "bar"
        },
        {
            value: 2,
            label: "Lineal",
            type: "line"
        }
    ];

    var fechaOpciones = [
        {
            value: 1,
            label: "Anual"
        },
        {
            value: 2,
            label: "Trimestral"
        }
    ];

    const [fechaOptions, setFechaOptions] = useState("Anual");

    const [graficoOptions, setGraficoOptions] = useState("line");

    const [sexoOptions, setSexoOptions] = useState("Ambos");

    const [añoOptions, setAñoOptions] = useState([
        {
            value: 1,
            label: "2021"
        },
    ]);

    const [añoSelected, setAñoSelected] = useState('2021');

    const handlerSexoOptions = e => {
        setSexoOptions(e.detail.value);
    }

    const handlerGraficoOptions = e => {
        setGraficoOptions(e.detail.value);
    }

    const handlerFechaOptions = e => {
        setFechaOptions(e.detail.value);
    }

    const handlerAñosOptions = e => {
        setAñoSelected(e.detail.value);
    }

    const [chartPoblacionActiva, setChartPoblacionActiva] = useState({});
    const [chartPATotal, setChartPATotal] = useState({});
    const [chartPAMen, setChartPAMen] = useState({});
    const [chartPAWomen, setChartPAWomen] = useState({});
    const [chartPoblacionOcupada, setChartPoblacionOcupada] = useState({});
    const [chartPoblacionParada, setChartPoblacionParada] = useState({});

    const [chartPoblacionesPercent, setChartPoblacionesPercent] = useState({});

    useEffect(() => {
        window.scroll(0,0);
        function años() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/poblacionOcupada', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                var año = {};
                let array2 = [];
                for (let i = 0; i < array.annualMen[1].length; i++) {
                    año.value = (i + 1);
                    año.label = array.annualMen[1][i];
                    array2.push({...año});
                }
                setAñoOptions(array2);
            })
            .catch(error => console.log(error))
        }
        function chartPoblacionActiva() {
        axios.get('https://visualizaapp.herokuapp.com/api/empleo/poblacionActiva', {}).then (
            response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                let array2 = response.data[index];
                if (sexoOptions === "Ambos" && fechaOptions === "Anual") {
                    array = array.annualTotal;
                } 
                if (sexoOptions === "Hombres" && fechaOptions === "Anual"){
                    array = array.annualMen;
                }
                if (sexoOptions === "Mujeres" && fechaOptions === "Anual"){
                    array = array.annualWomen;
                }
    
                if (sexoOptions === "Ambos" && fechaOptions === "Trimestral") {
                    array = array.quarterlyTotal;
                }
                if (sexoOptions === "Hombres" && fechaOptions === "Trimestral"){
                    array = array.quarterlyMen;
                }
                if (sexoOptions === "Mujeres" && fechaOptions === "Trimestral"){
                    array = array.quarterlyWomen;
                }
                setChartPoblacionActiva(array);
                if (fechaOptions === "Anual") {
                    setChartPATotal(array2.annualTotal);
                    setChartPAMen(array2.annualMen);
                    setChartPAWomen(array2.annualWomen);
                } else {
                    setChartPATotal(array2.quarterlyTotal);
                    setChartPAMen(array2.quarterlyMen);
                    setChartPAWomen(array2.quarterlyWomen);
                }
           })
           .catch(error => console.log(error))
        };

        function chartPoblacionOcupada() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/poblacionOcupada', {}).then (
            response => {
            let index = response.data.length - 1;
            let array = response.data[index];
            let array2 = response.data[index];
            if (sexoOptions === "Ambos" && fechaOptions === "Anual") {
                array = array.annualTotal;
            } 
            if (sexoOptions === "Hombres" && fechaOptions === "Anual"){
                array = array.annualMen;
            }
            if (sexoOptions === "Mujeres" && fechaOptions === "Anual"){
                array = array.annualWomen;
            }

            if (sexoOptions === "Ambos" && fechaOptions === "Trimestral") {
                array = array.quarterlyTotal;
            }
            if (sexoOptions === "Hombres" && fechaOptions === "Trimestral"){
                array = array.quarterlyMen;
            }
            if (sexoOptions === "Mujeres" && fechaOptions === "Trimestral"){
                array = array.quarterlyWomen;
            }

            let index2 = 0;
            let index3 = 0;
            if (añoSelected === undefined) {
                index2 = 0;
                index3 = 0;
            } else {
                index2 = (array2.annualMen[1]).indexOf(añoSelected);
                index3 = (array2.annualWomen[1]).indexOf(añoSelected);
            }

            let array3 = [];
            array3.push(((array2.annualMen[0][index2] * 100) / array2.annualTotal[0][index2]).toFixed(2));
            array3.push(((array2.annualWomen[0][index3] * 100) / array2.annualTotal[0][index3]).toFixed(2));

            setChartPoblacionesPercent(array3);
            setChartPoblacionOcupada(array);
            })
            .catch(error => console.log(error))
        };
        
        function chartPoblacionParada() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/poblacionParada', {}).then (
            response => {
            let index = response.data.length - 1;
            let array = response.data[index];
            if (sexoOptions === "Ambos" && fechaOptions === "Anual") {
                array = array.annualTotal;
            } 
            if (sexoOptions === "Hombres" && fechaOptions === "Anual"){
                array = array.annualMen;
            }
            if (sexoOptions === "Mujeres" && fechaOptions === "Anual"){
                array = array.annualWomen;
            }

            if (sexoOptions === "Ambos" && fechaOptions === "Trimestral") {
                array = array.quarterlyTotal;
            }
            if (sexoOptions === "Hombres" && fechaOptions === "Trimestral"){
                array = array.quarterlyMen;
            }
            if (sexoOptions === "Mujeres" && fechaOptions === "Trimestral"){
                array = array.quarterlyWomen;
            }
            setChartPoblacionParada(array);
            })
            .catch(error => console.log(error))
        };
        años();
        chartPoblacionActiva();
        chartPoblacionOcupada();
        chartPoblacionParada();
    }, [sexoOptions, fechaOptions, añoSelected]);

    var dataPoblacionActiva = {
        labels: chartPATotal[1],
        datasets: [{
            label: "Total",
            data: chartPATotal[0],
            type: 'line',
            backgroundColor: 'rgba(117, 101, 80, 0.3)',
            borderColor: 'rgba(117, 101, 80, 0.7)',
            hoverBackgroundColor: 'rgba(117, 101, 80, 0.4)',
            borderWidth: 1,
            pointBorderWidth: 7,
            pointHoverBorderWidth: 8,
            pointHitRadius: 1
        },
        {
            label: "Hombres",
            data: chartPAMen[0],
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgba(54, 162, 235, 1)',
            hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
            borderWidth: 1
        },
        {
            label: "Mujeres",
            data: chartPAWomen[0],
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgba(255, 99, 132, 1)',
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            borderWidth: 1
        }],
    }

    var dataPoblacionParada = {
        labels: chartPoblacionParada[1],
        datasets: [{
            label: "Población parada",
            type: graficoOptions,
            fill: true,
            data: chartPoblacionParada[0],
            borderSkipped: 'bottom',
            backgroundColor: [
                'rgba(111, 202, 165, 0.5)'
            ],
            borderColor: [
                'rgba(111, 202, 165, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(111, 202, 165, 0.4)'
            ],
            borderWidth: 1
        }],
    }

    var dataPoblaciones = {
        labels: chartPoblacionActiva[1],
        datasets: [{
            label: "Población activa",
            type: 'line',
            data: chartPoblacionActiva[0],
            borderSkipped: 'bottom',
            backgroundColor: [
                'rgba(255, 195, 0, 0.3)'
            ],
            borderColor: [
                'rgba(255, 195, 0, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(255, 195, 0, 0.4)'
            ],
            borderWidth: 1
        },
        {
            label: "Población ocupada",
            data: chartPoblacionOcupada[0],
            borderSkipped: 'bottom',
            backgroundColor: [
                'rgba(255, 87, 51, 0.3)'
            ],
            borderColor: [
                'rgba(255, 87, 51, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(255, 87, 51, 0.4)'
            ],
            borderWidth: 1
        },
        {
            label: "Población parada",
            data: chartPoblacionParada[0],
            borderSkipped: 'bottom',
            backgroundColor: [
                'rgba(111, 202, 165, 0.3)'
            ],
            borderColor: [
                'rgba(111, 202, 165, 1)'
            ],
            hoverBackgroundColor: [
                'rgba(111, 202, 165, 0.4)'
            ],
            borderWidth: 1
        }],
    }

    var dataPoblacionOcupada = {
        labels: [
            'Hombres',
            'Mujeres'
          ],
          datasets: [{
            data: [chartPoblacionesPercent[0], chartPoblacionesPercent[1]],
            backgroundColor: [
              'rgb(54, 162, 235)',
              'rgb(255, 99, 132)'
            ],
            hoverOffset: 4
        }]
    }
    
    var optionsPoblacionParada = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Cantidad de población parada (miles)',
                    font: {
                        family: 'Serif'
                    },
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        family: 'Serif'
                    },
                },
            },
            xAxes: {
                title: {
                    display: true,
                    text: 'Fecha de población parada (' + fechaOptions + ')',
                    font: {
                        family: 'Serif'
                    },
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        family: 'Serif'
                    },
                },
            },
        }, 
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Serif',
                    },
                    color: 'rgba(0, 0, 0, 1)'
                },
            },
            tooltip: {
                titleFont: {
                    family: 'Serif',
                },
                titleMarginBottom: 5,
                bodyFont: {
                    family: 'Serif',
                },
                caretSize: 6,
                cornerRadius: 10,
            }
        }
    }

    var optionsPoblacionOcupada = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            borderRadius: 3,
            color: 'rgba(117, 101, 80, 1)',
            font: {
              size: 30,
              weight: 'bold'
            },
            formatter: (value) => {
              if (value === 0) {
                return '';
              } else {
                return value + '%';
              }
            }
          },
        }
    }

    var optionsPoblacionActiva = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Cantidad de población activa (miles)',
                    font: {
                        family: 'Serif'
                    },
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        family: 'Serif'
                    },
                },
            },
            xAxes: {
                title: {
                    display: true,
                    text: 'Fecha de población activa (' + fechaOptions + ')',
                    font: {
                        family: 'Serif'
                    },
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        family: 'Serif'
                    },
                },
            },
        }, 
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Serif',
                    },
                    color: 'rgba(0, 0, 0, 1)'
                },
            },
            tooltip: {
                titleFont: {
                    family: 'Serif',
                },
                titleMarginBottom: 5,
                bodyFont: {
                    family: 'Serif',
                },
                caretSize: 6,
                cornerRadius: 10,
            }
        } 
    }

    var optionsPoblaciones = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Cantidad de población (miles)',
                    font: {
                        family: 'Serif'
                    },
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        family: 'Serif'
                    },
                },
            },
            xAxes: {
                title: {
                    display: true,
                    text: 'Fecha de población (' + fechaOptions + ')',
                    font: {
                        family: 'Serif'
                    },
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    font: {
                        family: 'Serif'
                    },
                },
            },
        }, 
        plugins: {
            legend: {
                labels: {
                    font: {
                        family: 'Serif',
                    },
                    color: 'rgba(0, 0, 0, 1)'
                },
            },
            tooltip: {
                titleFont: {
                    family: 'Serif',
                },
                titleMarginBottom: 5,
                bodyFont: {
                    family: 'Serif',
                },
                caretSize: 6,
                cornerRadius: 10,
            }
        }
    }
    
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>V I S U A L I Z A</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <IonRow>
                    <IonCol>
                        <h3 style={{'margin-top': '15px', 'letter-spacing': '3px', 'font-weight': 'bold'}}>POBLACIONES</h3>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <h5 className="text-start titleFilter">Escoja los filtros que desee:</h5>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="filterStyle">
                        <IonRow>
                            <IonCol>
                                <p class="text-start">Sexo:</p>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonList>
                                    <IonItem>
                                        <IonSelect value={sexoOptions} onIonChange={handlerSexoOptions}> 
                                        {sexoOpciones.map((sexo) => (
                                            <IonSelectOption key={sexo.value} value={sexo.label}>
                                                {sexo.label}
                                            </IonSelectOption>
                                        ))}
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                    <IonCol className="filterStyle">
                        <IonRow>
                            <IonCol>
                                <p class="text-end">Gráfico:</p>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonList>
                                    <IonItem>
                                        <IonSelect value={graficoOptions} onIonChange={handlerGraficoOptions}> 
                                        {graficoOpciones.map((grafico) => (
                                            <IonSelectOption key={grafico.value} value={grafico.type}>
                                                {grafico.label}
                                            </IonSelectOption>
                                        ))}
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="filterStyle">
                        <IonRow>
                            <IonCol>
                                <p class="text-end">Fecha:</p>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonList>
                                    <IonItem>
                                        <IonSelect value={fechaOptions} onIonChange={handlerFechaOptions}> 
                                        {fechaOpciones.map((fecha) => (
                                            <IonSelectOption key={fecha.value} value={fecha.label}>
                                                {fecha.label}
                                            </IonSelectOption>
                                        ))}
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                    <IonCol className="filterStyle" style={{'margin-right': '100px'}}>
                        <IonRow>
                            <IonCol>
                                <p class="text-end">Año:</p>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonList>
                                    <IonItem>
                                        <IonSelect value={añoSelected} onIonChange={handlerAñosOptions}> 
                                        {añoOptions.map((año) => (
                                            <IonSelectOption key={año.value} value={año.label}>
                                                {año.label}
                                            </IonSelectOption>
                                        ))}
                                        </IonSelect>
                                    </IonItem>
                                </IonList>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Población activa según sexos en los últimos años</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Bar data={dataPoblacionActiva} options={optionsPoblacionActiva}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Población activa, ocupada y parada en Canarias en los últimos años</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Bar data={dataPoblaciones} options={optionsPoblaciones}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Población ocupada en Canarias en el año {añoSelected}</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoPie">
                                <Pie data={dataPoblacionOcupada} plugins={[ChartDataLabels]} options={optionsPoblacionOcupada}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Población parada en los últimos años</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Bar data={dataPoblacionParada} options={optionsPoblacionParada}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    )
};

export default Poblaciones;
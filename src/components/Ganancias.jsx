import { IonList, IonSelect, IonSelectOption, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonItem } from '@ionic/react';
import React, {useState, useEffect} from 'react';
import {Chart, registerables } from 'chart.js';
import {Bar, Radar } from 'react-chartjs-2';
import './Ganancias.css';
import axios from 'axios';

Chart.register(...registerables);

const Ganancias = () => {

    var sexoOpciones = [
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

    const [graficoOptions, setGraficoOptions] = useState("bar");

    const [sexoOptions, setSexoOptions] = useState("Ambos");

    const [añoOptions, setAñoOptions] = useState([
        {
            value: 1,
            label: "2020"
        },
    ]);

    const [añoSelected, setAñoSelected] = useState('2020');

    const handlerSexoOptions = e => {
        setSexoOptions(e.detail.value);
    }

    const handlerGraficoOptions = e => {
        setGraficoOptions(e.detail.value);
    }

    const handlerAñosOptions = e => {
        setAñoSelected(e.detail.value);
    }

    const [chartGAMen, setChartGAMen] = useState({});
    const [chartGAWomen, setChartGAWomen] = useState({});

    const [chartGInd, setChartGInd] = useState({});
    const [chartGConst, setChartGConst] = useState({});
    const [chartGServ, setChartGServ] = useState({});
    const [chartGTotal, setChartGTotal] = useState({});

    useEffect(() => {
        window.scroll(0,0);
        function años() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/gananciaMediaAnual', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                array.annualTotalTotal[0] = array.annualTotalTotal[0].reverse();
                array.annualTotalTotal[1] = array.annualTotalTotal[1].reverse();
                var año = {};
                let array2 = [];
                for (let i = 0; i < array.annualTotalTotal[1].length; i++) {
                    año.value = (i + 1);
                    año.label = array.annualTotalTotal[1][i];
                    array2.push({...año});
                }
                setAñoOptions(array2);
            })
            .catch(error => console.log(error))
        }
        function chartGananciaMediaAnual() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/gananciaMediaAnual', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                let array2 = response.data[index];
                let arrayMen = [];

                let index2 = 0;
                let index3 = 0;
                let index4 = 0;
                if (añoSelected === undefined) {
                    index2 = 0;
                    index3 = 0;
                    index4 = 0;
                } else {
                    index2 = (array.annualMenInd[1]).indexOf(añoSelected);
                    index3 = (array.annualMenConst[1]).indexOf(añoSelected);
                    index4 = (array.annualMenServ[1]).indexOf(añoSelected);
                }
    
                arrayMen.push(array.annualMenInd[0][index2]);
                arrayMen.push(array.annualMenConst[0][index3]);
                arrayMen.push(array.annualMenServ[0][index4]);

                index2 = 0;
                index3 = 0;
                index4 = 0;
                if (añoSelected === undefined) {
                    index2 = 0;
                    index3 = 0;
                    index4 = 0;
                } else {
                    index2 = (array.annualWomenInd[1]).indexOf(añoSelected);
                    index3 = (array.annualWomenConst[1]).indexOf(añoSelected);
                    index4 = (array.annualWomenServ[1]).indexOf(añoSelected);
                }

                let arrayWomen = [];
                arrayWomen.push(array.annualWomenInd[0][index2]);
                arrayWomen.push(array.annualWomenConst[0][index3]);
                arrayWomen.push(array.annualWomenServ[0][index4]);

                if (sexoOptions === "Ambos") {
                    array2.annualTotalTotal[0] = array2.annualTotalTotal[0].reverse();
                    array2.annualTotalTotal[1] = array2.annualTotalTotal[1].reverse();
                    setChartGTotal(array2.annualTotalTotal)
                    array2.annualTotalInd[0] = array2.annualTotalInd[0].reverse();
                    array2.annualTotalInd[1] = array2.annualTotalInd[1].reverse();
                    setChartGInd(array2.annualTotalInd);
                    array2.annualTotalConst[0] = array2.annualTotalConst[0].reverse();
                    array2.annualTotalConst[1] = array2.annualTotalConst[1].reverse();
                    setChartGConst(array2.annualTotalConst);
                    array2.annualTotalServ[0] = array2.annualTotalServ[0].reverse();
                    array2.annualTotalServ[1] = array2.annualTotalServ[1].reverse();
                    setChartGServ(array2.annualTotalServ);
                }
                if (sexoOptions === "Hombres") {
                    array2.annualMenTotal[0] = array2.annualMenTotal[0].reverse();
                    array2.annualMenTotal[1] = array2.annualMenTotal[1].reverse();
                    setChartGTotal(array2.annualMenTotal)
                    array2.annualMenInd[0] = array2.annualMenInd[0].reverse();
                    array2.annualMenInd[1] = array2.annualMenInd[1].reverse();
                    setChartGInd(array2.annualMenInd);
                    array2.annualMenConst[0] = array2.annualMenConst[0].reverse();
                    array2.annualMenConst[1] = array2.annualMenConst[1].reverse();
                    setChartGConst(array2.annualMenConst);
                    array2.annualMenServ[0] = array2.annualMenServ[0].reverse();
                    array2.annualMenServ[1] = array2.annualMenServ[1].reverse();
                    setChartGServ(array2.annualMenServ); 
                }
                if (sexoOptions === "Mujeres") {
                    array2.annualWomenTotal[0] = array2.annualWomenTotal[0].reverse();
                    array2.annualWomenTotal[1] = array2.annualWomenTotal[1].reverse();
                    setChartGTotal(array2.annualWomenTotal)
                    array2.annualWomenInd[0] = array2.annualWomenInd[0].reverse();
                    array2.annualWomenInd[1] = array2.annualWomenInd[1].reverse();
                    setChartGInd(array2.annualWomenInd);
                    array2.annualWomenConst[0] = array2.annualWomenConst[0].reverse();
                    array2.annualWomenConst[1] = array2.annualWomenConst[1].reverse();
                    setChartGConst(array2.annualWomenConst);
                    array2.annualWomenServ[0] = array2.annualWomenServ[0].reverse();
                    array2.annualWomenServ[1] = array2.annualWomenServ[1].reverse();
                    setChartGServ(array2.annualWomenServ); 
                }
                setChartGAMen(arrayMen);
                setChartGAWomen(arrayWomen);
               })
               .catch(error => console.log(error))
        };
        años();
        chartGananciaMediaAnual();
    }, [sexoOptions, añoSelected]);

    var dataGananciaMediaAnual = {
        labels: [
            'Industria',
            'Construcción',
            'Servicio'
          ],
          datasets: [{
            label: 'Hombres',
            data: chartGAMen,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }, {
            label: 'Mujeres',
            data: chartGAWomen,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.4)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)'
          }]
    }

    var dataGananciaMediaAnualBar = {
        labels: chartGInd[1],
        datasets: [
        {
            label: "Total media anual",
            data: chartGTotal[0],
            type: 'line',
            backgroundColor: 'rgba(117, 101, 80, 0.3)',
            borderColor: 'rgba(117, 101, 80, 1)',
            hoverBackgroundColor: 'rgba(117, 101, 80, 0.4)',
            borderWidth: 1
        },
        {
            label: "Industria",
            data: chartGInd[0],
            type: graficoOptions,
            backgroundColor: 'rgba(255, 195, 0, 0.3)',
            borderColor: 'rgba(255, 195, 0, 1)',
            hoverBackgroundColor: 'rgba(255, 195, 0, 0.4)',
            borderWidth: 1
        },
        {
            label: "Construcción",
            data: chartGConst[0],
            type: graficoOptions,
            backgroundColor: 'rgba(255, 87, 51, 0.3)',
            borderColor: 'rgba(255, 87, 51, 1)',
            hoverBackgroundColor: 'rgba(255, 87, 51, 0.4)',
            borderWidth: 1
        },
        {
            label: "Servicio",
            data: chartGServ[0],
            type: graficoOptions,
            backgroundColor: 'rgba(111, 202, 165, 0.3)',
            borderColor: 'rgba(111, 202, 165, 1)',
            hoverBackgroundColor: 'rgba(111, 202, 165, 0.4)',
            borderWidth: 1
        }],
    }

    var optionsGananciaMediaAnual = {
        responsive: true,
        maintainAspectRatio: false,
        scale:{
            pointLabels:{
              fontSize: 5
            },
            ticks: {
              display: false,
            },
          },
          elements: {
            line: {
              borderWidth: 2,
            }
          },
          tooltips: {
            callbacks: {
              title: (tooltipItem, data) => data.labels[tooltipItem[0].index]
            }
        },
    }

    var optionsGananciaMediaAnualBar = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Cantidad de ganancia (miles)',
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
                    text: 'Fecha de ganancia (Anual)',
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
                    <IonTitle style={{ 'font-family': "Gill Sans Extrabold", 'font-weight': 'bold'}}>V I S U A L I Z A</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <IonRow>
                    <IonCol>
                        <h3 style={{'margin-top': '15px', 'letter-spacing': '3px', 'font-weight': 'bold'}}>GANANCIAS</h3>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <h5 className="text-start titleFilter">Escoja los filtros que desee:</h5>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonRow className="filterStyle">
                            <IonCol>
                                <p class="text-end">Sexo:</p>
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
                                <h4>Ganancia media anual por trabajador según sexos y sectores económicos (CNAE-09) en {añoSelected}</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Radar data={dataGananciaMediaAnual} options={optionsGananciaMediaAnual}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Ganancia media anual por trabajador según sexos y sectores económicos (CNAE-09) en los últimos años</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Bar data={dataGananciaMediaAnualBar} options={optionsGananciaMediaAnualBar}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    )
};

export default Ganancias;
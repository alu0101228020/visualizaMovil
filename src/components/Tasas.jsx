import { IonList, IonSelect, IonSelectOption, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonItem} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import {Chart, registerables } from 'chart.js';
import {Bar, PolarArea } from 'react-chartjs-2';
import './Tasas.css';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);

const Tasas = () => {

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

    const [añoOptions, setAñoOptions] = useState([
        {
            value: 1,
            label: "2021"
        },
    ]);

    const [añoSelected, setAñoSelected] = useState('2021');

    const handlerGraficoOptions = e => {
        setGraficoOptions(e.detail.value);
    }

    const handlerFechaOptions = e => {
        setFechaOptions(e.detail.value);
    }

    const handlerAñosOptions = e => {
        setAñoSelected(e.detail.value);
    }

    const [chartTasasPercent, setChartTasasPercent] = useState({});


    const [chartTAnnualTotalExercise, setChartTAnnualTotalExercise] = useState({});
    const [chartTAnnualTotalUnemployment, setChartTAnnualTotalUnemployment] = useState({});
    const [chartTAnnualTotalEmployment, setChartTAnnualTotalEmployment] = useState({});

    useEffect(() => {
        window.scroll(0,0);
        function chartDistintasTasas() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/distintasTasas', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                let array2 = response.data[index];
                array.annualTotalExercise[0] = array.annualTotalExercise[0].reverse();
                array.annualTotalExercise[1] = array.annualTotalExercise[1].reverse();

                array.annualTotalUnemployment[0] = array.annualTotalUnemployment[0].reverse();
                array.annualTotalUnemployment[1] = array.annualTotalUnemployment[1].reverse();

                array.annualTotalEmployment[0] = array.annualTotalEmployment[0].reverse();
                array.annualTotalEmployment[1] = array.annualTotalEmployment[1].reverse();

                if (fechaOptions === 'Anual') {
                    setChartTAnnualTotalExercise(array.annualTotalExercise);
                    setChartTAnnualTotalUnemployment(array.annualTotalUnemployment);
                    setChartTAnnualTotalEmployment(array.annualTotalEmployment);
                } else {
                    setChartTAnnualTotalExercise(array.quarterlyTotalExercise);
                    setChartTAnnualTotalUnemployment(array.quarterlyTotalUnemployment);
                    setChartTAnnualTotalEmployment(array.quarterlyTotalEmployment);
                }

                let index2 = 0;
                let index3 = 0;
                let index4 = 0;
                if (añoSelected === undefined) {
                    index2 = 0;
                    index3 = 0;
                    index4 = 0;
                } else {
                    index2 = (array2.annualTotalExercise[1]).indexOf(añoSelected);
                    index3 = (array2.annualTotalUnemployment[1]).indexOf(añoSelected);
                    index4 = (array2.annualTotalEmployment[1]).indexOf(añoSelected);
                }

                let total = array2.annualTotalExercise[0][index2] + array2.annualTotalUnemployment[0][index3] + array2.annualTotalEmployment[0][index4];
    
                let array3 = [];
                array3.push(((array2.annualTotalExercise[0][index2] * 100) / total).toFixed(2));
                array3.push(((array2.annualTotalUnemployment[0][index3] * 100) / total).toFixed(2));
                array3.push(((array2.annualTotalEmployment[0][index4] * 100) / total).toFixed(2));

                setChartTasasPercent(array3);
               })
               .catch(error => console.log(error))
        };
        function años() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/distintasTasas', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                array.annualTotalExercise[0] = array.annualTotalExercise[0].reverse();
                array.annualTotalExercise[1] = array.annualTotalExercise[1].reverse();
                var año = {};
                let array2 = [];
                for (let i = 0; i < array.annualTotalExercise[1].length; i++) {
                    año.value = (i + 1);
                    año.label = array.annualTotalExercise[1][i];
                    array2.push({...año});
                }
                setAñoOptions(array2);
            })
            .catch(error => console.log(error))
        }
        chartDistintasTasas();
        años();
    }, [fechaOptions, añoSelected]);

    var dataDistintasTasas = {
        labels: chartTAnnualTotalExercise[1],
        datasets: [{
            label: "Tasa de Actividad",
            data: chartTAnnualTotalExercise[0],
            type: graficoOptions,
            backgroundColor: 'rgba(197,132,6,0.3)',
            borderColor: 'rgba(197,132,6,0.7)',
            hoverBackgroundColor: 'rgba(197,132,6,0.4)',
            borderWidth: 1,
            pointBorderWidth: 7,
            pointHoverBorderWidth: 8,
            pointHitRadius: 1
        },
        {
            label: "Tasa de paro",
            data: chartTAnnualTotalUnemployment[0],
            type: graficoOptions,
            backgroundColor: 'rgba(27,107,35,0.3)',
            borderColor: 'rgba(27,107,35,0.7)',
            hoverBackgroundColor: 'rgba(27,107,35,0.4)',
            borderWidth: 1,
            pointBorderWidth: 7,
            pointHoverBorderWidth: 8,
            pointHitRadius: 1
        },
        {
            label: "Tasa de empleo",
            data: chartTAnnualTotalEmployment[0],
            type: graficoOptions,
            backgroundColor: 'rgba(130,19,183,0.3)',
            borderColor: 'rgba(130,19,183,0.7)',
            hoverBackgroundColor: 'rgba(130,19,183,0.4)',
            borderWidth: 1,
            pointBorderWidth: 7,
            pointHoverBorderWidth: 8,
            pointHitRadius: 1
        }],
    }

    var dataTasas = {
        labels: [
            'Actividad',
            'Paro',
            'Empleo'
          ],
          datasets: [{
            data: [chartTasasPercent[0], chartTasasPercent[1], chartTasasPercent[2]],
            backgroundColor: [
              'rgb(197, 132, 6, 0.5)',
              'rgb(27, 107, 35, 0.5)',
              'rgb(130, 19, 183, 0.5)'
            ],
            hoverOffset: 4
        }]
    }

    var optionsDistintasTasas = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Cantidad de población (%)',
                    /*font: {
                        size: 18,
                        family: 'Serif'
                    },*/
                    color: 'rgba(0, 0, 0, 1)',
                    padding: 3
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    /*font: {
                        size: 15,
                        family: 'Serif'
                    },*/
                },
            },
            xAxes: {
                title: {
                    display: true,
                    text: 'Fecha de población (' + fechaOptions + ')',
                    /*font: {
                        size: 18,
                        family: 'Serif'
                    },*/
                    color: 'rgba(0, 0, 0, 1)',
                    //padding: 15
                },
                ticks: {
                    color: 'rgba(0, 0, 0, 1)',
                    /*font: {
                        size: 15,
                        family: 'Serif'
                    },*/
                },
            },
        }, 
        plugins: {
            legend: {
                labels: {
                    /*font: {
                        size: 17,
                        family: 'Serif',
                    },*/
                    color: 'rgba(0, 0, 0, 1)',
                },
            },
            tooltip: {
                /*titleFont: {
                    size: 14,
                    family: 'Serif',
                },
                titleMarginBottom: 5,
                bodyFont: {
                    size: 14,
                    family: 'Serif',
                },*/
                caretSize: 6,
                cornerRadius: 10,
            }
        }
    }

    var optionsTasas = {
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
                        <h3 style={{'margin-top': '15px', 'letter-spacing': '3px', 'font-weight': 'bold'}}>TASAS</h3>
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
                    <IonCol className="styleChartTasas">
                        <IonRow>
                            <IonCol>
                                <h4>Tasas de actividad, paro y empleo en los últimos años</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Bar data={dataDistintasTasas} options={optionsDistintasTasas}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Tasas de actividad, paro y empleo en el año {añoSelected}</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <PolarArea data={dataTasas} plugins={[ChartDataLabels]} options={optionsTasas}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    )
};

export default Tasas;
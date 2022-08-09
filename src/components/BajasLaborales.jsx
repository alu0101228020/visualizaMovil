import { IonList, IonSelect, IonSelectOption, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonRow, IonCol, IonItem} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import {Chart, registerables } from 'chart.js';
import {Bar, Doughnut } from 'react-chartjs-2';
import './BajasLaborales.css';
import axios from 'axios';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(...registerables);

const BajasLaborales = () => {

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

    const handlerAñosOptions = e => {
        setAñoSelected(e.detail.value);
    }

    const [chartATAnnualTotalTotal, setChartATAnnualTotalTotal] = useState({});
    const [chartRAnnualTotalTotal, setChartRAnnualTotalTotal] = useState({});
    const [chartNRAnnualTotalTotal, setChartNRAnnualTotalTotal] = useState({});
    const [chartRPercent, setChartRPercent] = useState({});

    useEffect(() => {
        window.scroll(0,0);
        function años() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/recaidasDeAccidentes', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
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
        function chartAccidentesDeTrabajo() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/accidentesDeTrabajo', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                if (sexoOptions === 'Ambos') {
                    setChartATAnnualTotalTotal(array.annualTotalTotal);
                }
                if (sexoOptions === 'Hombres') {
                    setChartATAnnualTotalTotal(array.annualMenTotal);
                }
                if (sexoOptions === 'Mujeres') {
                    setChartATAnnualTotalTotal(array.annualWomenTotal);
                }
            })
            .catch(error => console.log(error))
        };
        function chartRecaidasDeAccidentes() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/recaidasDeAccidentes', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                let arrayPercent= [];

                let index2 = 0;
                let index3 = 0;
                if (sexoOptions === 'Ambos') {
                    if (añoSelected === undefined) {
                        index2 = 0;
                        index3 = 0;
                    } else {
                        index2 = (array.annualTotalMild[1]).indexOf(añoSelected);
                        index3 = (array.annualTotalSerious[1]).indexOf(añoSelected);
                    }
                    
                    arrayPercent.push(((array.annualTotalMild[0][index2] * 100) / array.annualTotalTotal[0][index2]).toFixed(2));
                    arrayPercent.push(((array.annualTotalSerious[0][index3] * 100) / array.annualTotalTotal[0][index3]).toFixed(2));
                    setChartRAnnualTotalTotal(array.annualTotalTotal);
                }
                if (sexoOptions === 'Hombres') {
                    if (añoSelected === undefined) {
                        index2 = 0;
                        index3 = 0;
                    } else {
                        index2 = (array.annualMenMild[1]).indexOf(añoSelected);
                        index3 = (array.annualMenSerious[1]).indexOf(añoSelected);
                    }
                    
                    arrayPercent.push(((array.annualMenMild[0][index2] * 100) / array.annualMenTotal[0][index2]).toFixed(2));
                    arrayPercent.push(((array.annualMenSerious[0][index3] * 100) / array.annualMenTotal[0][index3]).toFixed(2));
                    setChartRAnnualTotalTotal(array.annualMenTotal);
                }
                if (sexoOptions === 'Mujeres') {
                    if (añoSelected === undefined) {
                        index2 = 0;
                        index3 = 0;
                    } else {
                        index2 = (array.annualWomenMild[1]).indexOf(añoSelected);
                        index3 = (array.annualWomenSerious[1]).indexOf(añoSelected);
                    }
                    
                    arrayPercent.push(((array.annualWomenMild[0][index2] * 100) / array.annualWomenTotal[0][index2]).toFixed(2));
                    arrayPercent.push(((array.annualWomenSerious[0][index3] * 100) / array.annualWomenTotal[0][index3]).toFixed(2));
                    setChartRAnnualTotalTotal(array.annualWomenTotal);
                }

                setChartRPercent(arrayPercent);
            })
            .catch(error => console.log(error))
        };
        function chartNoRecaidasDeAccidentes() {
            axios.get('https://visualizaapp.herokuapp.com/api/empleo/noRecaidasDeAccidentes', {}).then (
                response => {
                let index = response.data.length - 1;
                let array = response.data[index];
                if (sexoOptions === 'Ambos') {
                    setChartNRAnnualTotalTotal(array.annualTotalTotal);
                }
                if (sexoOptions === 'Hombres') {
                    setChartNRAnnualTotalTotal(array.annualMenTotal);
                }
                if (sexoOptions === 'Mujeres') {
                    setChartNRAnnualTotalTotal(array.annualWomenTotal);
                }
            })
            .catch(error => console.log(error))
        };
        años();
        chartAccidentesDeTrabajo();
        chartRecaidasDeAccidentes();
        chartNoRecaidasDeAccidentes();
    }, [sexoOptions, añoSelected]);

    var dataAccidentesDeTrabajo = {
        labels: chartATAnnualTotalTotal[1],
        datasets: [{
            label: "Total de accidentes",
            data: chartATAnnualTotalTotal[0],
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
            label: "Recaidas",
            data: chartRAnnualTotalTotal[0],
            backgroundColor: 'rgba(27,49,177,0.3)',
            borderColor: 'rgba(27,49,177,1)',
            hoverBackgroundColor: 'rgba(27,49,177,0.4)',
            borderWidth: 1
        },
        {
            label: "No recaidas",
            data: chartNRAnnualTotalTotal[0],
            backgroundColor: 'rgba(201,73,43,0.3)',
            borderColor: 'rgba(201,73,43,1)',
            hoverBackgroundColor: 'rgba(201,73,43,0.4)',
            borderWidth: 1
        }],
    }

    var dataRecaidas = {
        labels: [
            'Leves',
            'Graves o muy graves'
          ],
          datasets: [{
            data: [chartRPercent[0], chartRPercent[1]],
            backgroundColor: [
              'rgba(18, 157, 136, 0.5)',
              'rgba(124, 45, 127, 0.5)'
            ],
            hoverOffset: 4
        }]
    }
    
    var optionsAccidentesDeTrabajo = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: 'Cantidad de accidentes (miles)',
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
                    text: 'Fecha de accidentes (Anual)',
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

    var optionsRecaidas = {
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
                    <IonTitle style={{ 'font-family': "Gill Sans Extrabold", 'font-weight': 'bold'}}>V I S U A L I Z A</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent class="ion-padding">
                <IonRow>
                    <IonCol>
                        <h3 style={{'margin-top': '15px', 'letter-spacing': '3px', 'font-weight': 'bold'}}>BAJAS LABORALES</h3>
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
                                <h4>Accidentes de trabajo con baja con y sin recaídas en los últimos años</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoBar">
                                <Bar data={dataAccidentesDeTrabajo} options={optionsAccidentesDeTrabajo}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol className="styleChartPoblaciones">
                        <IonRow>
                            <IonCol>
                                <h4>Recaidas en accidentes de trabajo con baja en {añoSelected}</h4>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol className="tamanoPie">
                                <Doughnut data={dataRecaidas} plugins={[ChartDataLabels]} options={optionsRecaidas}/>
                            </IonCol>
                        </IonRow>
                    </IonCol>
                </IonRow>
            </IonContent>
        </IonPage>
    )
};

export default BajasLaborales;
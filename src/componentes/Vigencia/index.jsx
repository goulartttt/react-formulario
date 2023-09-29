import React,{ useContext } from 'react';
import FormularioContext from '../../context/formularioContext';
import { Row, Col, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import services from '../../services';

const Vigencia = () => {
    const {inputs, setInputs, hoje, setInicioDaVigencia, setFimDaVigencia} = useContext(FormularioContext)

    function handleInputs(e){
        //nome
        let {name, value} = e.target;
        if(name === 'proponente') {
            value = value.toUpperCase()
        }
        if(name === 'cpf') {
            value = value.replace(/\D/g, '')
        }
        const input = {...inputs,[name]:value}

        setInputs(input)
    }


    //Inicio de vigencia

    async function inicioVigencia(e) {
        let {value} = e.target;
        console.log(value)
        const dataParseada = await new Date(value.split('/').reverse().join('-')).setHours(24);
        if (dataParseada < hoje) {
        toast('Atenção, coloque uma data superior ao dia de hoje');
        setInicioDaVigencia(null);
        e.target.value = '';
        } else {
        setInicioDaVigencia(dataParseada);
        }
    };
    //Fim de vigencia

    let diaAtual = new Date()
    let ano = diaAtual.getFullYear()

    async function fimVigencia(e){
        let {value} = e.target;
        console.log(value)
        let anoInserido = await new Date(value).getFullYear()  
        if (anoInserido <= ano) {
        toast("Atenção, coloque uma data supere 1 ano");
        setFimDaVigencia(null);
        e.target.value = '';
    } 
    }
    //Dias de Vigencia
    function diferencaDeDias(data1, data2){
        data1 = new Date(data1);
        data2 = new Date(data2);
        const diferencaDeTempo = Math.abs(data2 - data1);
        const diferencaDeDias = Math.ceil(diferencaDeTempo / (1000 * 60 * 60 * 24)); 
    
        return diferencaDeDias;
    }

    async function diasVigencia() {
        if (inputs.inicio_vigencia && inputs.fim_vigencia ) {
            const diaCalculado = await diferencaDeDias(inputs.inicio_vigencia, inputs.fim_vigencia);     
            setInputs({ ...inputs, dias_vigencia: diaCalculado.toString()});
     
        }
      }

    return (
        <>
            <Row>
                <Form.Group  as={Col} md="4">
                        <Form.Label>Inicio de Vigencia</Form.Label>
                        <Form.Control   
                            type='Date'
                            placeholder='Inicio de Vigencia'  
                            value={inputs?.inicio_vigencia}
                            name='inicio_vigencia'  
                            onBlur={inicioVigencia} 
                            onChange={(e) => handleInputs(e)}
                            required                           
                        />                                                      
                </Form.Group>
                <Form.Group  as={Col} md="4">
                        <Form.Label>Fim de Vigencia</Form.Label>
                        <Form.Control   
                            type='Date'
                            placeholder='Fim de Vigencia'
                            value={inputs?.fim_vigencia}
                            name='fim_vigencia'
                            onBlur={diasVigencia}   
                            onChange={(e) => {handleInputs(e);fimVigencia(e)}}
                            required                            
                        />  
                </Form.Group>
                <Form.Group  as={Col} md="4">
                        <Form.Label>Dias de Vigencia</Form.Label>
                        <Form.Control   
                            placeholder='Dias de Vigencia'
                            value={inputs?.dias_vigencia}
                            name='dias_vigencia'     
                            disabled                          
                        />  
                </Form.Group>
            </Row>

            <br/>
            <br/>
        </>
    )
}

export default Vigencia
import React,{ useContext, useEffect } from 'react';
import FormularioContext from '../../context/formularioContext';
import { Row, Col, Form } from 'react-bootstrap';
import services from '../../services';

const Coberturas = () => {
    const {inputs, setInputs, coberturas, setCoberturas, coberturaSelecionada, setCoberturaSelecionada, setDisabledBotao} = useContext(FormularioContext);

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

    async function getCoberturas(){
        try {
            const resp = await services.coberturas()
            setCoberturas(resp.coberturas)
            
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCoberturas();
    },[])

    
    function listarCoberturas(){
        return coberturas.map((cobertura, key) => (
            <option key={key} value={cobertura.nome}>
                {cobertura.nome}
            </option>
        ))
    }
    
    //Valor premio
    const liberaValorPremio = (e) => {
        const selectedValue = e.target.value;
        setCoberturaSelecionada(selectedValue);
    };

    const valorPremioDesabilitado = coberturaSelecionada === '';

    function onChangeIs(e) {
        const vlr = e.target.value;
        console.log(vlr)
        console.log(inputs)
        const cob = coberturas.find(c => c.nome === inputs.cobertura)
        console.log(cob)
        if (cob.min > vlr || vlr > cob.max) {
                setDisabledBotao(true)
        }else{
            setDisabledBotao(false)
        }
    }

    return(
        <>
            <Row>
                <Form.Group as={Col} md="6">
                    <Form.Label>Cobertura</Form.Label>
                    <Form.Select placeholder= "Cobertura" onChange={(e) => {handleInputs(e); liberaValorPremio(e)}} value={inputs?.cobertura} name='cobertura' required>
                        <option value="">Selecione</option>
                        {coberturas && listarCoberturas()}
                    </Form.Select>   

                </Form.Group>
                <Form.Group as={Col} md="6">
                        <Form.Label>Valor de Premio</Form.Label>
                        <Form.Control   
                            type='number'
                            placeholder='Valor de Premio' 
                            value={inputs?.valor_premio}
                            name='valor_premio'
                            onChange={(e) => {handleInputs(e); onChangeIs(e)}}    
                            required
                            disabled={valorPremioDesabilitado}                          
                        />  
                </Form.Group>
            </Row>
        </>
    )
}

export default Coberturas
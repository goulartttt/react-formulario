//importações
import './Formulario.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form } from 'react-bootstrap';
import React,{ useState } from 'react';
import FormularioContext from '../../context/formularioContext'; 
import Proponente from '../Proponente';
import Coberturas from '../Coberturas';
import Endereco from '../Endereco';
import Vigencia from '../Vigencia';
import Botao from '../Botao';

const Formulario = () => {

    const [coberturas, setCoberturas] = useState([]);
    const [inputs, setInputs] = useState({});
    const [disabledBotao, setDisabledBotao] = useState(false)
    const [hoje, setHoje] = useState(new Date().setHours(-1));
    const [inicioDaVigencia, setInicioDaVigencia] = useState(null);
    const [fimDaVigencia, setFimDaVigencia] = useState(null);
    const [coberturaSelecionada, setCoberturaSelecionada] = useState('');

    //Salvar Formulario
    
    return(
    <FormularioContext.Provider
        value={{
            inputs,
            setInputs,
            setDisabledBotao,
            coberturas,
            setCoberturas,
            coberturaSelecionada, 
            setCoberturaSelecionada,
            hoje,
            setInicioDaVigencia,
            setFimDaVigencia
        }}
    >
        <Container>
                <Form id='form'>
                    <h1>Seguro Empresarial</h1>
                    <Proponente/>
                    <Vigencia/>
                    <Endereco/>
                    <Coberturas/>
                    <Botao/>
                </Form>
        </Container>
    </FormularioContext.Provider>
    )
}

export default Formulario


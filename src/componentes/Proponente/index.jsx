import { useContext } from 'react';
import FormularioContext from '../../context/formularioContext';
import { Row, Col, Form } from 'react-bootstrap';
import services from '../../services';
import { toast } from 'react-toastify';


const Proponente = () => {
    const {inputs, setInputs, setDisabledBotao} = useContext(FormularioContext);

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
    };

    async function  blacklist(e){
        try{
          let {value} = e.target;
          if(value.length > 10){
            const resp = await services.blacklist({cpf: value.replace(/\D/g, '')})
            console.log(resp)
           if (!resp.success ) {
            toast('Risco recusado')
            setDisabledBotao(true)
            console.log("resp")
           }
          }
        }catch(erro){
            toast.error('Risco recusado')
            console.log(erro)
        }

    };

    return (
        <>
            <Row>                       
                <Form.Group  as={Col} md="6">
                    <Form.Label>Proponente</Form.Label>
                    <Form.Control   
                        type='text'
                        placeholder='Digite Seu Nome'
                        value={inputs?.proponente}
                        name='proponente'
                        onChange={(e) => handleInputs(e)}
                        min={3}
                        required
                    />                                                      
                </Form.Group>
                <Form.Group  as={Col} md="6">
                    <Form.Label>CPF</Form.Label>
                    <Form.Control   
                        type='text'
                        placeholder='CPF(apenas números)'
                        value={inputs?.cpf}
                        name='cpf'
                        onChange={(e) => handleInputs(e)}
                        onBlur={(e) => blacklist(e)}
                        min={11}
                        required
                    >                          
                    </Form.Control>
                </Form.Group>
            </Row>
        </>
    )
}

export default Proponente;
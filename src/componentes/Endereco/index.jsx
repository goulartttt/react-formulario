import React,{ useContext } from 'react';
import FormularioContext from '../../context/formularioContext';
import { Row, Col, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import services from '../../services';

const Endereco = () => {
    const {inputs, setInputs} = useContext(FormularioContext)

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
    
    function limpaFormularioCep() {
        setInputs({
            ...inputs,
            cep:'',
            logradouro : '',
            bairro :'',
            estado :'',
            cidade :''
        })
      }
    
      function meuCallback(conteudo) {
        
        if (!("erro" in conteudo)) {
            setInputs({
                ...inputs,
                logradouro : conteudo.logradouro,
                bairro :conteudo.bairro,
                cidade :conteudo.localidade,
                estado :conteudo.uf
            })
        } else {
          limpaFormularioCep();
          toast("CEP não encontrado.");
        }
      }
    
      async function consultarCepRestritos(valor) {
        valor = valor?.target?.value
        try {
          if (!/^[0-9]{8}$/.test(valor.replace(/\D/g, ''))) {
            return toast("CEP inválido");
          }

          const resp = await services.cepRestritos({ cep: valor });
          if (resp.success) {
            toast('Risco recusado');
            return;
          } else {
            limpaFormularioCep();
            console.log(valor)
            const cepLimpo = valor.replace(/\D/g, '');
            
    
            if (cepLimpo !== "") {
              var validacep = /^[0-9]{8}$/;
              if (validacep.test(cepLimpo)) {
                const cepSalvo = await services.buscaCep(cepLimpo)  
                console.log(cepSalvo)            
                setInputs({
                    ...inputs,
                    logradouro : cepSalvo.logradouro,
                    bairro :cepSalvo.bairro,
                    estado :cepSalvo.uf,
                    cidade :cepSalvo.localidade
                })
              } else {
                limpaFormularioCep();
                toast("Formato de CEP inválido.");
              }
            } else {
              limpaFormularioCep();
            }
          }
        } catch (erro) {
          console.log(erro);
        }
      }

    return (
        <>
            <Row>
                <Form.Group  as={Col} md="6">
                        <Form.Label>CEP</Form.Label>
                        <Form.Control   
                            type='Text'
                            placeholder='CEP'  
                            value={inputs?.cep}
                            name='cep'
                            onBlur={consultarCepRestritos}      
                            onChange={(e) => handleInputs(e)}    
                            required                    
                        />  
                </Form.Group>
                <Form.Group  as={Col} md="6">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control   
                            type='Text'
                            placeholder='Estado'  
                            value={inputs?.estado}
                            name='estado'       
                            onChange={(e) => handleInputs(e)}   
                            required                    
                        />  
                </Form.Group>
            </Row>
            <Row>
                <Form.Group  as={Col} md="6">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control   
                            type='Text'
                            placeholder='Cidade' 
                            value={inputs?.cidade}
                            name='cidade'     
                            onChange={(e) => handleInputs(e)} 
                            required                         
                        />  
                </Form.Group>
                <Form.Group  as={Col} md="6">
                        <Form.Label>Logradouro</Form.Label>
                        <Form.Control   
                            type='Text'
                            placeholder='Logradouro(Av., Rua, etc.)' 
                            value={inputs?.logradouro}
                            name='logradouro'     
                            onChange={(e) => handleInputs(e)}   
                            required                       
                        />  
                </Form.Group>
            </Row>
            <Row>
                <Form.Group  as={Col} md="12">
                        <Form.Label>Bairro</Form.Label>
                        <Form.Control   
                            type='Text'
                            placeholder='Bairro'  
                            value={inputs?.bairro}
                            name='bairro'       
                            onChange={(e) => handleInputs(e)}    
                            required                   
                        />  
                </Form.Group>
            </Row>
            <Row>
                <Form.Group  as={Col} md="6">
                        <Form.Label>Complemento</Form.Label>
                        <Form.Control   
                            type='Text'
                            placeholder='Complemento'    
                            value={inputs?.complemento}
                            name='complemento' 
                            onChange={(e) => handleInputs(e)}                            
                        />  
                </Form.Group>
                <Form.Group  as={Col} md="6">
                        <Form.Label>N°</Form.Label>
                        <Form.Control   
                            type='number'
                            placeholder='N°' 
                            value={inputs?.numero}
                            name='numero'
                            onChange={(e) => handleInputs(e)}        
                            required                       
                        />  
                </Form.Group>
            </Row>

                    <br/>
                    <br/>
        </>
    )
}

export default Endereco
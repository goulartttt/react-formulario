//importações
import './Formulario.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
// import Botao from '../Botao';
import services from '../../services';
import React,{ useEffect, useState} from 'react';
import { toast } from 'react-toastify';

const Formulario = () => {

    const [coberturas, setCoberturas] = useState([]);
    const [inputs, setInputs] = useState({});
    const [disabledBotao, setDisabledBotao] = useState(false)
    const [hoje, setHoje] = useState(new Date().setHours(-1));
    const [inicioDaVigencia, setInicioDaVigencia] = useState(null);
    const [fimDaVigencia, setFimDaVigencia] = useState(null);
    const [coberturaSelecionada, setCoberturaSelecionada] = useState('');

    //cpf
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

    }

    //inputs
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

    //Area de datas
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

      //Cep e complementos

      
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

  

         //Coberturas
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
    
    
    //Salvar Formulario
    async function salvarCotacao() {      
        try {
            if (!inputs.proponente || !inputs.cpf || !inputs.cep || !inputs.estado ||
                !inputs.cidade || !inputs.logradouro || !inputs.bairro ||!inputs.numero ||
                 !inputs.cobertura || !inputs.valor_premio ||!inputs.inicio_vigencia ||
                 !inputs.fim_vigencia) {
                return toast("Preencha os campos obrigatorios")
            }            
            const salvarInputs = {
                nome: inputs.proponente,
                cpf: inputs.cpf,
                endereco: {
                    cep: inputs.cep,
                    estado: inputs.estado,
                    cidade: inputs.cidade,
                    logradouro: inputs.logradouro,
                    bairro: inputs.bairro,
                    complemento: inputs.complemento,
                    numero: inputs.numero
                },
                coberturas: inputs.cobertura,
                valorPremio: inputs.valor_premio,
                inicioVigencia: inputs.inicio_vigencia,
                fimVigencia: inputs.fim_vigencia
            }

            const resp = await services.salvarCotacao(salvarInputs);
            if (resp.success) {
                limpaFormulario()
                toast("Cotação salva com sucesso")  
            } else {
               toast("Erro ao salvar cotação") 
            }
    
        } catch (error) {
            console.log(error)
        }
        
      }
       //Limpa Formulario
    function limpaFormulario() {
        setInputs({
            ...inputs,
            proponente :'',
            cpf:'',
            inicio_vigencia:'',
            fim_vigencia:'',
            dias_vigencia:'',
            cep:'',
            estado:'',
            cidade:'',
            logradouro:'',
            bairro:'',
            complemento:'',
            numero:'',
            cobertura:'',
            valor_premio:''
        })
    }

    return(
        <Container >
                <Form id='form'>
                    <h1>Seguro Empresarial</h1>
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
                    <Button disabled={disabledBotao} onClick={(e) => salvarCotacao(e)}>Enviar Cotação</Button>
                </Form>
        </Container>
    )
}

export default Formulario


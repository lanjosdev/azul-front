// Hooks / Libs:
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

// API:

// Contexts:
// import UserContext from "../../contexts/userContext";

// Components:
import { toast } from "react-toastify";
import { HeaderMenu } from "../../components/HeaderMenu/HeaderMenu";

// Assets:
import imgEmpty from '../../assets/photo_empty.webp';
// import videoTest from '../../assets/video9_16.mp4';

// Utils:
import { formatDecimal } from "../../utils/formatNumbers";

// Estilo:
import './style.css';



export default function Upload() {
    // Variaveis padrão:
    const megabyteNominal = 50;
    const megabyteLimit = megabyteNominal * 1048576;
    const infosNull = {
        name_file: null,
        dimensions: null,
        duration: null,
        size: null
    }; // { name_file: string | null, dimensions: {width: number, height: number}, duration: number, size: number }

    // Estados do componente:
    const [loadingFilePreview, setloadingFilePreview] = useState(false);
    const [loadingSubmit, setloadingSubmit] = useState(false);
    // const [hasError, setHasError] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    // const [validationMessage, setValidationMessage] = useState([]); // [{type: "success" | "error" | null, message: string}]

    // Logica UI:
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [infosVideo, setInfosVideo] = useState(infosNull); 



    // // Check validations
    // const isValidDuration = videoDuration !== null && videoDuration >= 10 && videoDuration <= 20;
    // const isValidAspectRatio = aspectRatio !== null && Math.abs(aspectRatio - 9 / 16) < 0.1;
    // const isVideoValid = isValidDuration && isValidAspectRatio;

    const tokenCookie = Cookies.get('tokenEstoque');

    useEffect(()=> {
        function initializePage() {
            console.log('Effect /Upload');
        } 
        initializePage();
    }, [tokenCookie]);





    
    function resetCurrentData() {
        if(previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setInfosVideo(infosNull);
        setSelectedFile(null);
    }

    function handleChangeFile(e) {
        const file = e.target.files?.[0] || null;
        setValidationErrors([]);

        // VALIDAÇÕES MINIMAS:
        if(!file) return;

        console.log(file);
        // Verificar se é um arquivo de vídeo mp4
        if(file.type != 'video/mp4') {
            setValidationErrors(prev=> [...prev, 'Por favor, selecione um arquivo de vídeo mp4.']);
            resetCurrentData();
            return;
        }

        if(file.size > megabyteLimit) {
            setValidationErrors(prev=> [...prev, `O arquivo de vídeo deve ter o tamanho máximo de ${megabyteNominal}MB.`]);
            resetCurrentData();
            return;
        }


        // GERA A URL PARA PRÉ-VISUALIZAÇÂO E SALVA MIDIA EM MEMORIA:
        setloadingFilePreview(true);

        try {
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        
            // Verificar duração e dimensões quando o vídeo for carregado
            const errors = [];

            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
                // coleta infos do video:
                const name_file = file.name;
                const dimensions = {
                    width: video.videoWidth,
                    height: video.videoHeight
                };
                const duration = video.duration.toFixed(1) || video.duration;
                const size = formatDecimal(file.size / 1048576);
                // console.log(size);
                setInfosVideo({ 
                    ...infosNull,
                    name_file,
                    dimensions,
                    duration,
                    size
                });

                

                // // Verificar duração (10-15 segundos)
                // if (duration < 10 || duration > 15) {
                //     setValidationMessage({
                //     type: "error",
                //     message: `O vídeo deve ter entre 10 e 15 segundos. Duração atual: ${duration.toFixed(1)} segundos.`,
                //     })
                // } 
                // else {
                //     // Verificar dimensões
                //     const width = video.videoWidth
                //     const height = video.videoHeight
                //     setVideoDimensions({ width, height })

                //     // Verificar proporção (1080x1920)
                //     if (width !== 1080 || height !== 1920) {
                //     setValidationMessage({
                //         type: "error",
                //         message: `O vídeo deve ter a proporção de 1080x1920. Dimensões atuais: ${width}x${height}.`,
                //     })
                //     } else {
                //     setValidationMessage({
                //         type: "success",
                //         message: "Vídeo válido! Pronto para upload.",
                //     })
                //     }
                // }
                
                
                setSelectedFile(file);
                setloadingFilePreview(false);
            }
            video.src = fileUrl;
        }
        catch(error) {
            console.error(error);
            setValidationErrors(['Houve um erro inesperado.']);
            
            resetCurrentData();
            setloadingFilePreview(false);
        }
        
        console.log('FIM');
    }
  

    return (
        <div className="Page Upload">

            <HeaderMenu />

            <main className='mainPage Upload grid'>
                <div className="main_top">
                    <h1>Upload de Vídeo</h1>
                </div>



                <div className="VideoUploader">
                    {/* Área de pré-visualização */}
                    <div className="container_preview">
                        <div className="preview">
                            {/* Apenas para deixar o elemento na proporção dinamica de 9:16 */}
                            <img src={imgEmpty} alt="" />
                            
                            {loadingFilePreview ? (
                                <div className="preview_empty">
                                    <p>Carregando a pré-visualização...</p>
                                </div>
                            ) : (
                                previewUrl ? (
                                    <video className="preview_video"
                                    src={previewUrl}
                                    controls={true}
                                    muted={true}
                                    // onLoadedMetadata={handleVideoLoad(função que é executada ao carregar video do preview, ai é possivel ver os dados)}
                                    />
                                ) : (
                                    <div className="preview_empty">
                                        <p className="txt_emphasis bold">Selecione um vídeo para upload</p>
                                        <p>
                                            Formato: 1080x1920 <br /> Duração: 10-15 segundos <br /> Extensão: .mp4 <br /> Tamanho maximo: 40MB
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Informações do vídeo */}
                    {selectedFile && (
                    <div className="infos">
                        {infosVideo?.name_file && (
                            <p>Mídia selecionada: {infosVideo.name_file}</p>
                        )}
                        {infosVideo?.dimensions && (
                            <p>Dimensões: {infosVideo.dimensions.width}x{infosVideo.dimensions.height}</p>
                        )}
                        {infosVideo?.duration && (
                            <p>Duração: {infosVideo.duration} segundos</p>
                        )}
                        {infosVideo?.size && (
                            <p>Tamanho: {infosVideo.size} MB</p>
                        )}
                    </div>
                    )}

                    {/* Mensagens de validação */}
                    {validationErrors.length > 0 && (
                    <div className="msg_feedback error">
                        {validationErrors.map((item, idx)=> (
                            <p className="item" key={idx}>
                                <i className="bi bi-exclamation-circle"></i>
                                <span> {item}</span>
                            </p>
                        ))}
                    </div>
                    )}



                    {/* Controle de ações */}
                    <div className="container_btns">
                        <label className="btn cancel">
                            <input className="non" 
                            type="file" 
                            accept="video/mp4" 
                            onChange={handleChangeFile} 
                            disabled={loadingSubmit}
                            />
                            {/* Selecionar vídeo */}
                        </label>

                        <button className="btn primary"
                        onClick={()=> toast.warn('Fazer a função')}
                        disabled={!selectedFile || validationErrors.length > 0 || loadingSubmit}
                        >
                            {loadingSubmit ? 'Enviando...' : 'Fazer upload'}
                        </button>
                    </div>
                </div>



            </main>

        </div>
    );
}
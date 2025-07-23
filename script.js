// script.js - Lógica Principal do Sistema

document.addEventListener('DOMContentLoaded', () => {
    const orcamentoForm = document.getElementById('orcamentoForm');
    const nomeClienteRelatorio = document.getElementById('nomeClienteRelatorio');
    const marcaModeloGeralRelatorio = document.getElementById('marcaModeloGeralRelatorio');
    const observacaoGeralRelatorio = document.getElementById('observacaoGeralRelatorio');
    const detalhesComodosRelatorio = document.getElementById('detalhesComodosRelatorio');
    const listaItensTotalRelatorio = document.getElementById('listaItensTotalRelatorio');
    const totalItensGeralSumario = document.getElementById('totalItensGeralSumario');
    const relatorioGeradoDiv = document.getElementById('relatorioGerado');
    const imprimirRelatorioBtn = document.getElementById('imprimirRelatorio');
    const comodosContainer = document.getElementById('comodosContainer');
    const comodoTemplate = document.getElementById('comodoTemplate');
    const addComodoBtn = document.getElementById('addComodoBtn');
    const resetOrcamentoBtn = document.getElementById('resetOrcamentoBtn');

    // Novos botões de gerar relatório
    const gerarRelatorioCompletoBtn = document.getElementById('gerarRelatorioCompletoBtn');
    const gerarRelatorioResumidoBtn = document.getElementById('gerarRelatorioResumidoBtn');

    // Seções do relatório para controlar a visibilidade
    const detalhesComodosSection = document.getElementById('detalhesComodosSection');
    const totalGeralItensSection = document.getElementById('totalGeralItensSection');


    // `comodoCounter` é usado para gerar IDs únicos, não para a numeração visível no momento.
    // A numeração visível será feita pela função `updateComodoNumbers`.
    let comodoCounter = 0;

    // Mapeamento de IDs de itens para seus nomes e categorias
    const itensMapeamento = {
        // Disjuntores
        'qtdDisjuntorUnipolar16A': { nome: 'Disjuntor Unipolar 16A', categoria: 'Disjuntores' },
        'qtdDisjuntorUnipolar20A': { nome: 'Disjuntor Unipolar 20A', categoria: 'Disjuntores' },
        'qtdDisjuntorBipolar25A': { nome: 'Disjuntor Bipolar 25A', categoria: 'Disjuntores' },
        'qtdDisjuntorBipolar32A': { nome: 'Disjuntor Bipolar 32A', categoria: 'Disjuntores' },

        // Espelhos 4x2
        'qtdEspelho4x2Cego': { nome: 'Espelho 4x2 para Módulo Cego', categoria: 'Espelhos com Base 4x2' },
        'qtdEspelho4x2UmModulo': { nome: 'Espelho 4x2 para Um Módulo', categoria: 'Espelhos com Base 4x2' },
        'qtdEspelho4x2DoisModulos': { nome: 'Espelho 4x2 para Dois Módulos', categoria: 'Espelhos com Base 4x2' },
        'qtdEspelho4x2TresModulos': { nome: 'Espelho 4x2 para Três Módulos', categoria: 'Espelhos com Base 4x2' },

        // Espelhos 4x4
        'qtdEspelho4x4Cego': { nome: 'Espelho 4x4 para Módulo Cego', categoria: 'Espelhos com Base 4x4' },
        'qtdEspelho4x4DoisModulos': { nome: 'Espelho 4x4 para Dois Módulos', categoria: 'Espelhos com Base 4x4' },
        'qtdEspelho4x4QuatroModulos': { nome: 'Espelho 4x4 para Quatro Módulos', categoria: 'Espelhos com Base 4x4' },
        'qtdEspelho4x4SeisModulos': { nome: 'Espelho 4x4 para Seis Módulos', categoria: 'Espelhos com Base 4x4' },

        // Módulos
        'qtdModuloInterruptorSimples': { nome: 'Módulo de Interruptor Simples', categoria: 'Módulos' },
        'qtdModuloInterruptorParalelo': { nome: 'Módulo de Interruptor Paralelo', categoria: 'Módulos' },
        'qtdModuloInterruptorIntermediario': { nome: 'Módulo de Interruptor Intermediário', categoria: 'Módulos' },
        'qtdModuloTomada10A': { nome: 'Módulo de Tomada 10A', categoria: 'Módulos' },
        'qtdModuloTomada20A': { nome: 'Módulo de Tomada 20A', categoria: 'Módulos' },
        'qtdModuloTomada20AVermelha': { nome: 'Módulo de Tomada 20A Vermelha', categoria: 'Módulos' },
        'qtdModuloUmFuro': { nome: 'Módulo de Um Furo', categoria: 'Módulos' },
        'qtdModuloRJ': { nome: 'Módulo RJ (Rede/Telefone)', categoria: 'Módulos' },
        'qtdTerminalRede': { nome: 'Terminal de Rede', categoria: 'Módulos' },
        'qtdModuloCegoModulo': { nome: 'Módulo Cego (Avulso)', categoria: 'Módulos' }
    };


    // --- Funções de Gerenciamento de Cômodos ---

    function addComodo(comodoData = null) {
        comodoCounter++;
        const newComodoBlock = comodoTemplate.content.cloneNode(true);
        const comodoDiv = newComodoBlock.querySelector('.comodo-block');

        // Atribui um ID único ao novo bloco de cômodo
        comodoDiv.dataset.comodoId = `Ambiente-${comodoCounter}`;
        // O número do cômodo será definido pela função updateComodoNumbers`.

        // Seleciona os elementos dentro do NOVO bloco de cômodo
        const ambienteSelect = comodoDiv.querySelector('.ambiente-select');
        const outrosAmbienteGroup = comodoDiv.querySelector('.outros-ambiente-group');
        const outrosAmbienteInput = comodoDiv.querySelector('.outros-ambiente-input');
        const qtdInputs = comodoDiv.querySelectorAll('.qtd-input');
        const removeComodoBtn = comodoDiv.querySelector('.remove-comodo-btn');

        // Lógica para mostrar/esconder o campo "Outros" para ESTE cômodo
        ambienteSelect.addEventListener('change', () => {
            if (ambienteSelect.value === 'Outros') {
                outrosAmbienteGroup.style.display = 'block';
                outrosAmbienteInput.setAttribute('required', 'required');
                outrosAmbienteInput.focus();
            } else {
                outrosAmbienteGroup.style.display = 'none';
                outrosAmbienteInput.removeAttribute('required');
                outrosAmbienteInput.value = '';
            }
            saveFormData(); // Salva ao mudar ambiente
        });

        // Adiciona event listeners para salvar dados em tempo real para os inputs de quantidade
        qtdInputs.forEach(input => {
            input.addEventListener('input', saveFormData);
            input.addEventListener('change', saveFormData); // Para pegar também o clique na setinha
        });

        // Adiciona event listener para salvar dados ao mudar o campo outrosAmbiente
        outrosAmbienteInput.addEventListener('input', saveFormData);

        // Event listener para o botão Remover Cômodo
        removeComodoBtn.addEventListener('click', () => {
            comodoDiv.remove();
            updateComodoNumbers(); // Atualiza a numeração após remover
            saveFormData(); // Salva após remover
            generateAndDisplayReport('completo'); // Regenera o relatório completo para refletir a mudança
        });

        // Se houver dados para pré-preencher este cômodo (ao carregar do localStorage)
        if (comodoData) {
            ambienteSelect.value = comodoData.ambiente || '';
            // Dispara o evento change para que o campo "Outros" seja exibido/ocultado corretamente
            ambienteSelect.dispatchEvent(new Event('change'));
            outrosAmbienteInput.value = comodoData.outrosAmbiente || '';

            for (const itemId in comodoData.itens) {
                const input = comodoDiv.querySelector(`[data-item-id="${itemId}"]`);
                if (input) {
                    input.value = comodoData.itens[itemId];
                }
            }
        }

        comodosContainer.appendChild(comodoDiv);
        updateComodoNumbers(); // Atualiza a numeração ao adicionar
        setupQuantityControls(comodoDiv); // Configura os botões para o novo cômodo
        return comodoDiv; // Retorna o elemento adicionado
    }

    // Função para atualizar a numeração dos cômodos no formulário
    function updateComodoNumbers() {
        const comodoBlocks = comodosContainer.querySelectorAll('.comodo-block');
        comodoBlocks.forEach((comodoDiv, index) => {
            const comodoNumberSpan = comodoDiv.querySelector('.comodo-number');
            if (comodoNumberSpan) {
                comodoNumberSpan.textContent = index + 1; // Define o número do cômodo
            }
        });
    }

    // Função para configurar os botões de quantidade para um cômodo específico
    function setupQuantityControls(comodoDiv) {
        const quantityButtons = comodoDiv.querySelectorAll('.quantity-btn');

        quantityButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const input = event.target.closest('.quantity-control').querySelector('.qtd-input');
                let currentValue = parseInt(input.value);

                if (event.target.dataset.action === 'increase') {
                    currentValue++; // Incrementa de 1 em 1
                } else if (event.target.dataset.action === 'decrease') {
                    if (currentValue > 0) { // Garante que a quantidade não seja negativa
                        currentValue--; // Decrementa de 1 em 1
                    }
                }
                input.value = currentValue;
                saveFormData(); // Salva os dados após a alteração da quantidade
            });
        });

        // Adiciona um event listener para o input de quantidade para salvar os dados ao digitar
        comodoDiv.querySelectorAll('.qtd-input').forEach(input => {
            input.addEventListener('input', () => {
                // Garante que apenas números sejam aceitos
                input.value = input.value.replace(/[^0-9]/g, '');
                // Garante que o valor não seja negativo, mesmo se digitado
                if (parseInt(input.value) < 0) {
                    input.value = 0;
                }
                saveFormData();
            });
        });
    }

    // --- Funções de Salvar e Carregar Dados (Adaptadas para Múltiplos Cômodos) ---
    function saveFormData() {
        const formData = {
            nomeCliente: document.getElementById('nomeCliente').value,
            marcaModeloGeral: document.getElementById('marcaModeloGeral').value,
            observacaoGeral: document.getElementById('observacaoGeral').value,
            comodos: []
        };

        const comodoBlocks = comodosContainer.querySelectorAll('.comodo-block');
        comodoBlocks.forEach(comodoDiv => {
            const comodoData = {
                ambiente: comodoDiv.querySelector('.ambiente-select').value,
                outrosAmbiente: comodoDiv.querySelector('.outros-ambiente-input').value,
                itens: {}
            };
            comodoDiv.querySelectorAll('.qtd-input').forEach(input => {
                comodoData.itens[input.dataset.itemId] = input.value;
            });
            formData.comodos.push(comodoData);
        });

        localStorage.setItem('orcamentoData', JSON.stringify(formData));
        console.log('Dados salvos no localStorage.');
    }

    function loadFormData() {
        const savedData = localStorage.getItem('orcamentoData');
        if (savedData) {
            const formData = JSON.parse(savedData);

            document.getElementById('nomeCliente').value = formData.nomeCliente || '';
            document.getElementById('marcaModeloGeral').value = formData.marcaModeloGeral || '';
            document.getElementById('observacaoGeral').value = formData.observacaoGeral || '';

            // Limpa qualquer cômodo inicial antes de carregar
            comodosContainer.innerHTML = '';
            comodoCounter = 0; // Reseta o contador de cômodos

            if (formData.comodos && formData.comodos.length > 0) {
                formData.comodos.forEach(comodoData => {
                    const newComodoDiv = addComodo(comodoData); // Adiciona e pré-preenche cada cômodo salvo
                    setupQuantityControls(newComodoDiv); // Configura os botões para os cômodos carregados
                });
            } else {
                addComodo(); // Se não houver cômodos salvos, adiciona um cômodo vazio
            }
            console.log('Dados carregados do localStorage.');
            // Ao carregar, não geramos o relatório automaticamente, o usuário deve clicar em um dos botões.
            // generateAndDisplayReport('completo'); // Removido para que o usuário escolha
        } else {
            addComodo(); // Se não houver dados salvos, adiciona o primeiro cômodo vazio
        }
    }

    // Função para resetar tudo
    window.resetFormAndStorage = function() {
        orcamentoForm.reset(); // Reseta os campos globais
        comodosContainer.innerHTML = ''; // Limpa todos os blocos de cômodo
        comodoCounter = 0; // Reseta o contador
        addComodo(); // Adiciona um cômodo vazio novamente
        localStorage.removeItem('orcamentoData'); // Remove os dados do localStorage
        relatorioGeradoDiv.style.display = 'none'; // Esconde o relatório
        imprimirRelatorioBtn.style.display = 'none'; // Esconde o botão de imprimir
        detalhesComodosSection.style.display = 'block'; // Garante que esteja visível para o próximo relatório completo
        totalGeralItensSection.style.display = 'block'; // Garante que esteja visível para o próximo relatório completo
        console.log('Formulário e localStorage resetados.');
    };

    // --- Lógica de Geração do Relatório (Adaptada para Múltiplos Cômodos e Tipos) ---
    function generateAndDisplayReport(tipoRelatorio = 'completo') { // 'completo' ou 'resumido'
        detalhesComodosRelatorio.innerHTML = ''; // Limpa o relatório detalhado
        listaItensTotalRelatorio.innerHTML = ''; // Limpa o relatório total
        relatorioGeradoDiv.style.display = 'none'; // Esconde enquanto gera

        const nomeCliente = document.getElementById('nomeCliente').value;
        const marcaModeloGeral = document.getElementById('marcaModeloGeral').value.trim();
        const observacaoGeral = document.getElementById('observacaoGeral').value.trim();

        nomeClienteRelatorio.textContent = `Nome do Cliente: ${nomeCliente || 'Não Informado'}`;

        if (marcaModeloGeral) {
            marcaModeloGeralRelatorio.textContent = `Marca/Modelo Preferida: ${marcaModeloGeral}`;
            marcaModeloGeralRelatorio.style.display = 'block';
        } else {
            marcaModeloGeralRelatorio.style.display = 'none';
        }

        if (observacaoGeral) {
            observacaoGeralRelatorio.textContent = `Observações: ${observacaoGeral}`;
            observacaoGeralRelatorio.style.display = 'block';
        } else {
            observacaoGeralRelatorio.style.display = 'none';
        }

        const todosComodosData = [];
        const comodoBlocks = comodosContainer.querySelectorAll('.comodo-block');

        // Coleta os dados de cada cômodo
        comodoBlocks.forEach((comodoDiv, index) => {
            let ambienteSelecionado = comodoDiv.querySelector('.ambiente-select').value;
            const outrosAmbiente = comodoDiv.querySelector('.outros-ambiente-input').value;

            if (ambienteSelecionado === 'Outros') {
                ambienteSelecionado = outrosAmbiente ? `Outros: ${outrosAmbiente}` : 'Outros (Não Especificado)';
            } else if (!ambienteSelecionado) {
                ambienteSelecionado = 'Não especificado';
            }

            // Agrupa itens por categoria para este cômodo
            const itensPorCategoria = {
                'Disjuntores': [],
                'Espelhos com Base 4x2': [],
                'Espelhos com Base 4x4': [],
                'Módulos': []
            };

            let totalItensComodo = 0;

            comodoDiv.querySelectorAll('.qtd-input').forEach(input => {
                const quantidade = parseInt(input.value) || 0;
                const itemId = input.dataset.itemId;
                if (quantidade > 0 && itensMapeamento[itemId]) {
                    const itemInfo = itensMapeamento[itemId];
                    if (itensPorCategoria[itemInfo.categoria]) {
                        itensPorCategoria[itemInfo.categoria].push({
                            nome: itemInfo.nome,
                            quantidade: quantidade
                        });
                        totalItensComodo += quantidade;
                    }
                }
            });

            todosComodosData.push({
                numero: index + 1, // Mantemos este índice para numeração no relatório
                ambiente: ambienteSelecionado,
                itensPorCategoria: itensPorCategoria, // Agora os itens estão agrupados
                total: totalItensComodo
            });
        });

        // --- Geração do Relatório Detalhado por Cômodo (apenas se tipoRelatorio for 'completo') ---
        if (tipoRelatorio === 'completo') {
            detalhesComodosSection.style.display = 'block'; // CORRIGIDO: de 'detalhos' para 'detalhes'
            if (todosComodosData.length > 0) {
                todosComodosData.forEach(comodo => {
                    const comodoRelatorioDiv = document.createElement('div');
                    comodoRelatorioDiv.classList.add('comodo-relatorio-item');
                    comodoRelatorioDiv.innerHTML = `<h4>Cômodo ${comodo.numero}: ${comodo.ambiente}</h4>`;

                    let hasItems = false;
                    // Itera sobre as categorias e seus itens
                    for (const categoria in comodo.itensPorCategoria) {
                        const itensDaCategoria = comodo.itensPorCategoria[categoria];
                        if (itensDaCategoria.length > 0) {
                            hasItems = true;
                            const categoriaH5 = document.createElement('h5');
                            categoriaH5.textContent = categoria;
                            comodoRelatorioDiv.appendChild(categoriaH5);

                            const ul = document.createElement('ul');
                            itensDaCategoria.forEach(item => {
                                const li = document.createElement('li');
                                li.textContent = `${item.quantidade}x ${item.nome}`;
                                ul.appendChild(li);
                            });
                            comodoRelatorioDiv.appendChild(ul);
                        }
                    }

                    if (!hasItems) {
                        const pNoItems = document.createElement('p');
                        pNoItems.textContent = 'Nenhum item selecionado para este ambiente.';
                        comodoRelatorioDiv.appendChild(pNoItems);
                    }

                    const totalP = document.createElement('p');
                    totalP.innerHTML = `<strong>Total de Itens deste Ambiente: ${comodo.total}</strong>`;
                    comodoRelatorioDiv.appendChild(totalP);
                    detalhesComodosRelatorio.appendChild(comodoRelatorioDiv);
                });
            } else {
                detalhesComodosRelatorio.innerHTML = '<p>Nenhum ambiente foi adicionado.</p>';
            }
        } else {
            detalhesComodosSection.style.display = 'none'; // Esconde a seção de detalhes por cômodo
        }


        // --- Geração do Relatório de Total Geral de Itens ---
        totalGeralItensSection.style.display = 'block'; // Sempre visível para ambos os tipos de relatório
        const totalItensGeral = {};
        let somaTotalGeralQuantidade = 0;

        todosComodosData.forEach(comodo => {
            // Itera sobre as categorias dentro de cada cômodo para somar os itens
            for (const categoria in comodo.itensPorCategoria) {
                comodo.itensPorCategoria[categoria].forEach(item => {
                    if (totalItensGeral[item.nome]) {
                        totalItensGeral[item.nome] += item.quantidade;
                    } else {
                        totalItensGeral[item.nome] = item.quantidade;
                    }
                    somaTotalGeralQuantidade += item.quantidade;
                });
            }
        });

        const sortedTotalItens = Object.keys(totalItensGeral).sort().map(nome => ({
            nome: nome,
            quantidade: totalItensGeral[nome]
        }));

        if (sortedTotalItens.length > 0) {
            sortedTotalItens.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${item.nome}:</span> <span><strong>${item.quantidade}</strong></span>`;
                listaItensTotalRelatorio.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Nenhum item somado em todos os ambientes.';
            listaItensTotalRelatorio.appendChild(li);
        }

        totalItensGeralSumario.innerHTML = `Total de Itens Diversos (Geral): <strong>${somaTotalGeralQuantidade}</strong>`;


        // Exibe o relatório
        relatorioGeradoDiv.style.display = 'block';
        imprimirRelatorioBtn.style.display = 'block';

        // Recria o event listener do botão de impressão para evitar duplicação
        const oldImprimirBtn = imprimirRelatorioBtn;
        const newImprimirBtn = oldImprimirBtn.cloneNode(true);
        oldImprimirBtn.parentNode.replaceChild(newImprimirBtn, oldImprimirBtn);

        newImprimirBtn.addEventListener('click', () => {
            window.print();
        });

        // Salva os dados após gerar o relatório
        saveFormData();
    }


    // --- Inicialização e Event Listeners ---

    // Carregar dados ao iniciar a página ou adicionar o primeiro cômodo
    loadFormData();

    // Event listener para o botão "Adicionar Cômodo +"
    addComodoBtn.addEventListener('click', () => {
        addComodo();
        saveFormData(); // Salva após adicionar um novo cômodo
    });

    // Event listener para o botão "Refazer Orçamento"
    if (resetOrcamentoBtn) {
        resetOrcamentoBtn.addEventListener('click', resetFormAndStorage);
    } else {
        console.error("Elemento 'resetOrcamentoBtn' não encontrado.");
    }

    // Event listeners para os novos botões de gerar relatório
    gerarRelatorioCompletoBtn.addEventListener('click', () => {
        generateAndDisplayReport('completo');
    });

    gerarRelatorioResumidoBtn.addEventListener('click', () => {
        generateAndDisplayReport('resumido');
    });

    // Adiciona event listeners para salvar dados nos campos globais (nome, marca, obs)
    document.getElementById('nomeCliente').addEventListener('input', saveFormData);
    document.getElementById('marcaModeloGeral').addEventListener('input', saveFormData);
    document.getElementById('observacaoGeral').addEventListener('input', saveFormData);

    // Garante que o relatório não está visível ao carregar se não houver dados válidos.
    if (!localStorage.getItem('orcamentoData')) {
        relatorioGeradoDiv.style.display = 'none';
        imprimirRelatorioBtn.style.display = 'none';
    }
});
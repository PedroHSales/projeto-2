document.getElementById('formProdutos').addEventListener('submit', function (event) {
  event.preventDefault(); // Evita o recarregamento da página
  
  // Efetuando validações
  let nomeProduto = document.getElementById('nome').value;
  if (nomeProduto.length < 5) {
    alerta('⚠ O nome é muito curto!', 'info');
    document.getElementById('nome').focus();
    return; // Encerra a função se o nome for muito curto
  } else if (nomeProduto.length > 100) {
    alerta('⚠ O nome é muito longo!', 'info');
    document.getElementById('nome').focus();
    return; // Encerra a função se o nome for muito longo
  }
  
  // Criando o objeto de Produtos
  let segmentoSelecionado = "";
  if (document.getElementById("segmento-0").checked) {
    segmentoSelecionado = "Uso interno";
  } else if (document.getElementById("segmento-1").checked) {
    segmentoSelecionado = "Pintura";
  } else {
    segmentoSelecionado = "Acabamento";
  }

  const dadosProduto = {
    id_produto: document.getElementById("id_produto").value,
    nome: nomeProduto,
    preco: document.getElementById("preco").value,
    marca: document.getElementById("marca").value,
    tipo: document.getElementById("tipo").value,
    segmento: segmentoSelecionado,
  };

  // Verificando se é uma inclusão ou alteração
  if (document.getElementById('id_produto').value !== '') { // Se existir algo, iremos alterar,
    alterar(event, 'produtos', dadosProduto, document.getElementById('id_produto').value);
  } else {
    incluir(event, 'produtos', dadosProduto);
  }
});

async function incluir(event, collection, dados) {
  event.preventDefault()
  return await firebase.database().ref(collection).push(dados)
    .then(() => {
      alerta('✅ Produto incluído com sucesso!', 'success')
      document.getElementById('formProdutos').reset()//limpa
    })
    .catch(error => {
      alerta('❌ Falha ao incluir: ' + error.message, 'danger')
    })
}

async function alterar(event, collection, dados, id) {
  event.preventDefault()
  return await firebase.database().ref().child(collection + '/' + id).update(dados)
    .then(() => {
      alerta('✅ Produto alterado com sucesso!', 'success')
      document.getElementById('formProdutos').reset()//limpa
    })
    .catch(error => {
      alerta('❌Falha ao alterar: ' + error.message, 'danger')
    })
}

async function obtemProdutos() {
  let spinner = document.getElementById('carregandoDados');
  let tabela = document.getElementById('tabelaDados');

  await firebase.database().ref('produtos').on('value', (snapshot) => {
    tabela.innerHTML = ''; // Limpa o conteúdo atual da tabela
    tabela.innerHTML += `
            <tr class='bg-warning'>
             <th>Id do Produto</th>   
             <th>Nome</th>   
             <th>Preço</th>
             <th>Marca</th>
             <th>Tipo</th> 
             <th>Segmento</th>     
             <th>Opções</th>
            </tr>
    `;

    snapshot.forEach(item => {
      //Dados do Firebase
      let id = item.key; // ID do produto
      let produto = item.val(); // Dados do produto

      //Criando as novas linhas da tabela
      let novaLinha = tabela.insertRow(); //insere uma nova linha na tabela
      novaLinha.insertCell().textContent = id; // Insere o ID do produto

      // Insere os dados do produto nas células da tabela
      novaLinha.insertCell().textContent = produto.nome;
      novaLinha.insertCell().textContent = produto.preco;
      novaLinha.insertCell().textContent = produto.marca;
      novaLinha.insertCell().textContent = produto.tipo;
      novaLinha.insertCell().textContent = produto.segmento;

      // Cria botões de opções para editar e excluir o produto
      let opcoes = `
        <button class='btn btn-sm btn-danger' title='Apagar o produto selecionado' onclick="remover('produtos', '${id}')">
          <i class='bi bi-trash'></i>
        </button>
        <button class='btn btn-sm btn-info' title='Editar o produto selecionado' onclick="carregaDadosAlteracao('produtos', '${id}')">
          <i class='bi bi-pencil-square'></i>
        </button>
      `;
      novaLinha.insertCell().innerHTML = opcoes;
    });
  });

  //ocultamos o botão Carregando...
  spinner.classList.add('d-none');
}

async function remover(db, id) {
  if (window.confirm('⚠ Confirma a exclusão do produto?')) {
    let dadosExclusao = await firebase.database().ref().child(db + '/' + id)
    dadosExclusao.remove()
      .then(() => {
        alerta('✅ Produto removido com sucesso!', 'success')
      })
      .catch(error => {
        alerta(`❌ Falha ao apagar o Produto: ${error.message}`)
      })
  }
}

async function carregaDadosAlteracao(db, id) {
  await firebase.database().ref(db + '/' + id).on('value', (snapshot) => {
    document.getElementById('id_produto').value = snapshot.val().id_produto
    document.getElementById('nome').value = snapshot.val().nome
    document.getElementById('preco').value = snapshot.val().preco
    document.getElementById('marca').value = snapshot.val().marca
    document.getElementById('tipo').value = snapshot.val().tipo
      if (snapshot.val().segmento === 'Uso interno') {
        document.getElementById('segmento-0').checked = true;
      } else if (snapshot.val().segmento === 'Pintura') {
        document.getElementById('segmento-1').checked = true;
      } else if (snapshot.val().segmento === 'Acabamento') {
        document.getElementById('segmento-2').checked = true;
      }
    });
  document.getElementById('nome').focus() //Definimos o foco no campo nome
}

function filtrarTabela(idFiltro, idTabela) {
  // Obtém os elementos HTML
  var input = document.getElementById(idFiltro); // Input de texto para pesquisa
  var filter = input.value.toUpperCase(); // Valor da pesquisa em maiúsculas
  var table = document.getElementById(idTabela); // Tabela a ser filtrada
  var tr = table.getElementsByTagName("tr"); // Linhas da tabela

  // Oculta todas as linhas da tabela inicialmente (exceto o cabeçalho)
  for (var i = 1; i < tr.length; i++) { // Começa em 1 para ignorar o cabeçalho
    tr[i].style.display = "none"; // Oculta a linha
  }

  // Filtra cada linha da tabela
  for (var i = 1; i < tr.length; i++) { // Começa em 1 para ignorar o cabeçalho
    for (var j = 0; j < tr[i].cells.length; j++) { // Percorre as células da linha
      var td = tr[i].cells[j]; // Célula atual
      if (td) { // Verifica se a célula existe
        var txtValue = td.textContent || td.innerText; // Conteúdo da célula
        txtValue = txtValue.toUpperCase(); // Conteúdo da célula em maiúsculas

        // Verifica se o valor da pesquisa está presente no conteúdo da célula
        if (txtValue.indexOf(filter) > -1) {
          tr[i].style.display = ""; // Exibe a linha se houver correspondência
          break; // Sai do loop interno quando encontrar uma correspondência
        }
      }
    }
  }
}
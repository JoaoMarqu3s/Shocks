// front.js - Interações e Estilização do Frontend

document.addEventListener('DOMContentLoaded', () => {
    // A lógica de mostrar/esconder o campo "Outros" agora está no script.js
    // dentro da função addComodo, pois é por cômodo.

    // A lógica do botão de reset também está no script.js

    // Exemplo de interação: Adicionar uma classe quando um input está focado
    // Seleciona TODOS os inputs, selects e textareas na página
    const allInputsAndTextareas = document.querySelectorAll('input[type="text"], input[type="number"], select, textarea');

    allInputsAndTextareas.forEach(element => {
        element.addEventListener('focus', () => {
            element.classList.add('focused-input');
        });
        element.addEventListener('blur', () => {
            element.classList.remove('focused-input');
        });
    });

    console.log("front.js carregado e pronto para interações de UI!");
});
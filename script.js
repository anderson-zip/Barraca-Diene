let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
        
        
    });
    

    c('.pizza-area').append(pizzaItem);
});

//EVENTOS MODAL
function closeModal(){
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);

}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});
c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQt>1){
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
    
});
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;

});
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click',(e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});
c('.pizzaInfo--addButton').addEventListener('click',()=>{
    //tamanho
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>{
        return item.identifier == identifier;
    });

    if(key> -1){
        cart[key].qt += modalQt;
    }else{
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }

    closeModal();
    updateCart();

});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = '0';
    }
    
});

c('.menu-closer').addEventListener('click',()=>{
    c('aside').style.left = '100vw';
});

const nomeInput = document.getElementById('nome');
const cpfInput = document.getElementById('cpf');
const finalizarBtn = document.querySelector('.cart--finalizar');

// Função que verifica se pode habilitar o botão
function verificarCampos() {
  const nomeValido = nomeInput.value.trim() !== '';
  const cpfValido = cpfInput.value.trim().length === 11;

  if (nomeValido && cpfValido) {
    finalizarBtn.classList.add('ativo');
    finalizarBtn.style.pointerEvents = 'auto';
    finalizarBtn.style.opacity = '1';
  } else {
    finalizarBtn.classList.remove('ativo');
    finalizarBtn.style.pointerEvents = 'none';
    finalizarBtn.style.opacity = '0.5';
  }
}

// Verifica os campos a cada digitação
nomeInput.addEventListener('input', verificarCampos);
cpfInput.addEventListener('input', verificarCampos);


// Ação ao clicar em "Finalizar a compra"
finalizarBtn.addEventListener('click', function () {
  if (finalizarBtn.classList.contains('ativo')) {
    const nome = nomeInput.value.trim();
    const cpf = cpfInput.value.trim();
    const desc = document.getElementById('desc').value.trim();
    console.log('Nome:', nome);
    console.log('CPF:', cpf);
    // Aqui você pode chamar sua função de envio para o WhatsApp, etc.
    let mensagem = `
============================
    🛒 PEDIDO CONFIRMADO
============================

👤Nome: *${nome}*
🆔CPF: ${cpf}\n\n`;

    let total = 0;
    for(let i in cart){
        let carItem = pizzaJson.find((item)=>item.id == cart[i].id);
        console.log(carItem);
        mensagem += `📦 *Itens*:\n• ${carItem.name} (x${cart[i].qt}) - R$ ${(carItem.price * cart[i].qt).toFixed(2)}\n`;
        total +=carItem.price * cart[i].qt;
        
    }

    if (desc) {
        mensagem += `\n📝 Observações: ${desc}\n`;
      }

    mensagem += `\n\n💳 *Total*: R$ ${total.toFixed(2)}`;
    console.log(mensagem);

    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Número do WhatsApp (com DDI e DDD, ex: 55 + 71 + número)
    const numero = '5571992477319'; // Substitua pelo seu número

    // Abre o WhatsApp Web ou app
    const url = `https://wa.me/${numero}?text=${mensagemCodificada}`;
    window.open(url, '_blank');
    }
});

// Inicializa desabilitado
verificarCampos();

c('.cart--finalizar').addEventListener('click',()=>{
    
});

function updateCart(){

    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length >0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }



            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1){
                    cart[i].qt--;
                }else{
                    cart.splice(i,1);
                }
                
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);

        }

        //desconto = subtotal * 0.1;
        //total = subtotal - desconto;
        total = subtotal

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        //c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    }else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }

}
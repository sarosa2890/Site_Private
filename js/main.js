document.addEventListener('DOMContentLoaded', () => {
    // Ваши данные
    const BOT_TOKEN = '7901558796:AAEMw7R_YcMZMG5gvvcmEQIUAlLgOBBDqKk';
    const CHAT_ID = '1284206128';

    // Элементы страницы
    const paymentModal = document.getElementById('paymentModal');
    const usernameInput = document.querySelector('.tg-input');
    const tariffSelect = document.getElementById('tariffSelect');

    // Открытие модального окна
    window.selectPlan = (planType) => {
        paymentModal.style.display = 'flex';
        const tariffMap = { 'extra': 0, 'forever': 1 };
        if(tariffMap.hasOwnProperty(planType)) {
            tariffSelect.selectedIndex = tariffMap[planType];
        }
    }

    // Отправка данных
    window.submitPayment = async () => {
        const username = usernameInput.value.trim().replace('@', '');
        const tariff = tariffSelect.options[tariffSelect.selectedIndex].text;

        if(!username) {
            showAlert('⚠️ Введите ваш Telegram username!', 'error');
            return;
        }

        try {
            const message = `🤑 Новая оплата!\n👤 @${username}\n📦 ${tariff}\n⏰ ${new Date().toLocaleString('ru-RU')}`;
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });

            const data = await response.json();
            
            if(data.ok) {
                showAlert('✅ Успешно! Админ @linkscum0 свяжется с вами', 'success');
                paymentModal.style.display = 'none';
                usernameInput.value = '';
            } else {
                throw new Error(data.description || 'Ошибка Telegram API');
            }
        } catch(error) {
            console.error('Ошибка:', error);
            showAlert(`❌ Ошибка: ${error.message}`, 'error');
        }
    }

    // Закрытие модалки
    paymentModal.addEventListener('click', (e) => {
        if(e.target === paymentModal) paymentModal.style.display = 'none';
    });

    // Показать уведомление
    function showAlert(text, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.textContent = text;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
});
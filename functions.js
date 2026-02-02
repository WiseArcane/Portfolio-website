AOS.init({
    duration: 1000,
    once: false,
    mirror: true,
    easing: 'ease-in-out'
});

const glow = document.createElement('div');
glow.style.cssText = `
    position: fixed;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
`;
document.body.appendChild(glow);

window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

async function fetchGithubRepos(username) {
    const container = document.getElementById('github-projects');
    
    container.innerHTML = '<p class="loading">Fetching my latest work...</p>';

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) throw new Error('Not found');
        
        const repos = await response.json();

        container.innerHTML = '';

        repos.forEach((repo, index) => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', index * 100);

            card.innerHTML = `
                <div class="repo-content">
                    <div class="repo-header">
                        <i class="fab fa-github"></i>
                        <h3>${repo.name}</h3>
                    </div>
                    <p>${repo.description || "A custom project built with focus on efficiency and clean code."}</p>
                    <div class="repo-footer">
                        <div class="repo-stats">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        </div>
                        <a href="${repo.html_url}" target="_blank" class="repo-link">Explore →</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Could not load projects. Check back soon!</p>";
    }
}

fetchGithubRepos('WiseArcane');

const modal = document.getElementById('success-modal');
const closeBtn = document.getElementById('close-modal');

document.querySelector('.contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const webhookURL = 'https://discord.com/api/webhooks/1004341838754369637/J2e2ognmnQ3ssGv342LGPhyFco2qU4f5teHTyHPq0W1um8y5C2QAlKsfqxVdcImz-9ja';

    const payload = {
        embeds: [{
            title: 'New Portfolio Message',
            color: 0x4facfe,
            fields: [
                { name: 'Name', value: name, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Message', value: message }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch(webhookURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            modal.classList.add('active');
            e.target.reset();
        } else {
            alert('Failed to send message. Please check the webhook URL.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the message.');
    }
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
});
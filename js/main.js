const PARTICLE_COUNT = 24;
const PARTICLE_COLORS = [
  "#FF1461", "#18FF92", "#5A87FF", "#FBF38C",
  "#fc7c7c", "#93e1d8", "#f5e960", "#ec6eae"
];

function createAnimeExplosion(x, y) {
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; ++i) {
    const particle = document.createElement("div");
    particle.className = "explosion-particle";
    particle.style.background = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
    particle.style.left = `${x - 4}px`;
    particle.style.top = `${y - 4}px`;
    document.body.appendChild(particle);
    particles.push(particle);
  }

  anime({
    targets: particles,
    translateX: () => anime.random(-120, 120),
    translateY: () => anime.random(-120, 120),
    scale: [
      {value: anime.random(1.8, 2.4), easing: 'easeOutBack', duration: 250},
      {value: 0.4, easing: 'easeInBack', duration: 400}
    ],
    opacity: [
      {value: 0.92, duration: 0},
      {value: 0, duration: 650}
    ],
    easing: 'easeOutCubic',
    duration: 700,
    complete: function() {
      particles.forEach(p => p.remove());
    }
  });
}

// 全局点击监听
window.addEventListener('click', function(e) {
  createAnimeExplosion(e.clientX, e.clientY);
});

const app = Vue.createApp({
    mixins: Object.values(mixins),
    data() {
        return {
            loading: true,
            hiddenMenu: false,
            showMenuItems: false,
            menuColor: false,
            scrollTop: 0,
            renderers: [],
        };
    },
    created() {
        window.addEventListener("load", () => {
            this.loading = false;
        });
    },
    mounted() {
        window.addEventListener("scroll", this.handleScroll, true);
        this.render();

        // ---- 新增：防止重复绑定，先解绑再绑定 ----
        window.removeEventListener('click', this._particleExplosionInternal);
        this._particleExplosionInternal = this.handleParticleExplosion.bind(this);
        window.addEventListener('click', this._particleExplosionInternal);
    },
    beforeUnmount() {
        window.removeEventListener('click', this._particleExplosionInternal);
    },
    methods: {
        render() {
            for (let i of this.renderers) i();
        },
        handleScroll() {
            let wrap = this.$refs.homePostsWrap;
            let newScrollTop = document.documentElement.scrollTop;
            if (this.scrollTop < newScrollTop) {
                this.hiddenMenu = true;
                this.showMenuItems = false;
            } else this.hiddenMenu = false;
            if (wrap) {
                if (newScrollTop <= window.innerHeight - 100) this.menuColor = true;
                else this.menuColor = false;
                if (newScrollTop <= 400) wrap.style.top = "-" + newScrollTop / 5 + "px";
                else wrap.style.top = "-80px";
            }
            this.scrollTop = newScrollTop;
        },
        handleParticleExplosion(e) {
            // 这里填 anime.js 粒子爆炸实现
            createAnimeExplosion(e.clientX, e.clientY);
        },
    },
});
app.mount("#layout");

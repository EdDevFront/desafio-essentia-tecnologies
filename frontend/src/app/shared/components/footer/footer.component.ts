import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="w-full border-t border-white/10 bg-[#050505] py-8 mt-auto text-center text-sm text-[#b1bbb1]">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <p>© 2026 TechX Task Management - Desenvolvido para Desafio Técnico.</p>
        <p class="text-xs text-[#b1bbb1]/70">
          Inspirado em <span class="text-[#FBB03B]">Essentia Technologies</span> design system.
        </p>
      </div>
    </footer>
  `
})
export class FooterComponent {}

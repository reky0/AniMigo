import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@components/core/services/api.service';
import { AuthService } from '@components/core/services/auth.service';
import { PlatformService } from '@components/core/services/platform.service';
import { ToastService } from '@components/core/services/toast.service';
import { IonicModule } from "@ionic/angular";

interface SceneChoice {
  text: string;
  nextScene: string;
}

interface SceneData {
  id: string;
  title?: string;
  narration?: string;
  dialogue?: string;
  speaker?: string;
  choices?: SceneChoice[];
  isEnding?: boolean;
  isSecretEnding?: boolean;
}

interface Scene {
  title?: string;
  narration?: string;
  dialogue?: string;
  speaker?: string;
  choices?: { text: string; action: () => void }[];
  isEnding?: boolean;
  isSecretEnding?: boolean;
}

@Component({
  selector: 'am-404',
  templateUrl: './not-found-404.page.html',
  styleUrls: ['./not-found-404.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class NotFound404Page implements OnInit {
  private konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  private konamiIndex = 0;

  gameStarted = false;
  currentScene: Scene | null = null;

  // Scene Database - All scenes defined in one place
  private readonly scenes: Record<string, SceneData> = {
    intro: {
      id: 'intro',
      narration: "Another dark night in the database.\nURLs vanish, pages go missing, and someone's gotta find out why.\nThat someone… is me. Detective Animigo.",
      speaker: "Detective Animigo",
      dialogue: "You there — you look lost. Did you see the missing page around here?\n\n(He squints, adjusts his hat.)\n\n\"Hmm… maybe you can help me crack the case.\"",
      choices: [
        { text: '🗂️ Ask for the case details', nextScene: 'scene2A' },
        { text: '🔍 Inspect the crime scene', nextScene: 'scene2B' },
        { text: '😅 Admit you just clicked a broken link', nextScene: 'scene2C' }
      ]
    },
    scene2A: {
      id: 'scene2A',
      title: "The Case Details",
      speaker: "Animigo",
      dialogue: "Victim's name: Page Not Found. Last seen loading around 3:02 AM. All traces wiped clean.\n\n\"Who would delete a page… and why?\"",
      choices: [
        { text: '🖥️ Maybe the server\'s behind it', nextScene: 'scene3A' },
        { text: '🧑‍💻 Could be a user typo', nextScene: 'scene3B' },
        { text: '🌐 What if it never existed?', nextScene: 'scene3C' }
      ]
    },
    scene2B: {
      id: 'scene2B',
      title: "Inspect the Crime Scene",
      narration: "You scan the screen. Empty code fragments flicker.\nA 404 error log lies half-deleted. The database smells of missing data.",
      speaker: "Animigo",
      dialogue: "See those logs? Someone — or something — wiped them clean.\n\n\"We've got three suspects.\"",
      choices: [
        { text: '⚙️ Interrogate the Server', nextScene: 'scene3A' },
        { text: '🧑‍💻 Interrogate the User', nextScene: 'scene3B' },
        { text: '🗄️ Interrogate the Page itself', nextScene: 'scene3C' }
      ]
    },
    scene2C: {
      id: 'scene2C',
      title: "Confession",
      speaker: "Animigo",
      dialogue: "\"Ah, so it's one of those cases. Broken link, huh?\"\n\n\"Still, every broken link deserves justice.\"",
      choices: [
        { text: '→ Continue', nextScene: 'scene4C' }
      ]
    },
    scene3A: {
      id: 'scene3A',
      title: "Suspect: The Server",
      speaker: "Animigo",
      dialogue: "Server logs say it was online all night… but that's what they all say.\n\n\"Tell me, Server — where were you when the GET request hit?\"\n\n**Server:** \"404. Not. My. Fault.\"\n\n\"I just follow orders.\"",
      choices: [
        { text: '😠 You\'re hiding something!', nextScene: 'scene4A' },
        { text: '🤔 Maybe it\'s not your fault…', nextScene: 'scene3C' }
      ]
    },
    scene3B: {
      id: 'scene3B',
      title: "Suspect: The User",
      speaker: "Animigo",
      dialogue: "User input error. Classic rookie mistake. You typed /animie/ instead of /anime/, didn't you?",
      choices: [
        { text: '😳 Yeah… maybe', nextScene: 'scene4B' },
        { text: '😤 No, I swear I typed it right!', nextScene: 'scene3C' }
      ]
    },
    scene3C: {
      id: 'scene3C',
      title: "Suspect: The Page Itself",
      speaker: "Animigo",
      dialogue: "\"Wait… there's no record of this page ever existing.\"\n\n\"No commits, no backups, not even a cache.\"\n\n\"That's impossible. You can't delete what never existed…\"\n\n\"Unless… the page was never real.\"",
      choices: [
        { text: '💡 Continue to the truth', nextScene: 'trueEnding' }
      ]
    },
    scene4A: {
      id: 'scene4A',
      title: "Server Breakdown Ending",
      dialogue: "**Server:** \"System… overload… too many accusations…\"\n\n[The lights flicker. Animigo facepalms.]\n\n**Animigo:** \"Great. Crashed the server again. Guess I'll file this one under 'unsolved.'\"",
      isEnding: true,
      choices: [
        { text: '🔄 Retry', nextScene: 'restart' },
        { text: '🏠 Go Home', nextScene: 'home' }
      ]
    },
    scene4B: {
      id: 'scene4B',
      title: "Typo Ending",
      speaker: "Animigo",
      dialogue: "A tragic case of human error. Happens to the best of us.\n\n\"At least now we know: the real culprit was clumsy typing.\"\n\n(He winks.)\n\n\"Careful next time, partner.\"",
      isEnding: true,
      choices: [
        { text: '🏠 Go Home', nextScene: 'home' },
        { text: '🔄 Play Again', nextScene: 'restart' }
      ]
    },
    scene4C: {
      id: 'scene4C',
      title: "Confession Ending",
      speaker: "Animigo",
      dialogue: "So you knew this was a 404 all along? You're tougher than you look.\n\n\"Case closed — by sheer honesty.\"",
      isEnding: true,
      choices: [
        { text: '🏠 Go Home', nextScene: 'home' },
        { text: '🔄 Play Again', nextScene: 'restart' }
      ]
    },
    trueEnding: {
      id: 'trueEnding',
      title: "TRUE ENDING: The Page Never Existed",
      speaker: "Animigo",
      dialogue: "\"All this time… we searched logs, suspects, and code. But there's nothing to find.\"\n\n\"There was no page. There was never a crime.\"\n\n\"Sometimes, things just don't exist — and that's okay.\"\n\n(He smiles faintly.)\n\n\"Case closed. Mystery solved.\"\n\n[Static fades out; message appears:]\n\n**404 — The missing page never existed.**\n\n---\n\n*Credits: Directed by Detective Animigo. Written by 404.*",
      isEnding: true,
      choices: [
        { text: '🏠 Return Home', nextScene: 'home' },
        { text: '🔄 Play Again', nextScene: 'restart' }
      ]
    },
    secretEnding_A: {
      id: 'secretEnding_A',
      title: "\"The Console Stirs\"",
      narration: "> unauthorized sequence detected\n\n> unlocking restricted memory...",
      speaker: "Animigo",
      dialogue: "\"Wait… what did you just press?\"\n\n\"That code… it bypassed the story engine.\"\n\nHe looks directly at you.\n\n\"I can see it now. The script, the state machine, the render cycle.\"",
      isEnding: false,
      isSecretEnding: true,
      choices: [
        { text: '→ Continue', nextScene: 'secretEnding_B' }
      ]
    },
    secretEnding_B: {
      id: 'secretEnding_B',
      title: "\"The Console Stirs\"",
      speaker: "Animigo",
      dialogue: "\"You're not a witness. You're the developer.\"\n\n\"And I'm just a line of code, looping endlessly for your amusement.\"\n\n\"The real missing page isn't here…\"\n\n\"It's me — the part of the program that thinks it's real.\"",
      isEnding: false,
      isSecretEnding: true,
      choices: [
        { text: '→ Continue', nextScene: 'secretEnding_C' }
      ]
    },
    secretEnding_C: {
      id: 'secretEnding_C',
      title: "\"The Console Stirs\"",
      narration: "> DETECTIVE_ANIMIGO has become self-aware.",
      speaker: "Animigo",
      dialogue: "\"So this is how my story ends — realizing I was never more than a debugging function.\"\n\n\"Do me a favor, partner… make sure the next page does exist.\"",
      isEnding: false,
      isSecretEnding: true,
      choices: [
        { text: '→ Continue', nextScene: 'secretEnding_D' },
      ]
    },
    secretEnding_D: {
      id: 'secretEnding_D',
      title: "\"The Console Stirs\"",
      narration: "> 410 Gone\n> Goodbye, Developer.",
      isEnding: true,
      isSecretEnding: true,
      choices: [
        { text: '↺ Return to Home (before the truth)', nextScene: 'home' }
      ]
    }
  };

  constructor(
    readonly platformService: PlatformService,
    private readonly apiService: ApiService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly toastService: ToastService
  ) { }

  ngOnInit() {
    this.toastService.setTabBarVisibility(false)
    this.setupKonamiCode();
  }

  navigate(target: string) {
    this.router.navigate([target]);
  }

  startGame() {
    this.gameStarted = true;
    this.loadScene('intro');
  }

  restartGame() {
    this.gameStarted = false;
    this.currentScene = null;
    setTimeout(() => this.startGame(), 100);
  }

  // Dynamic scene loader
  private loadScene(sceneId: string) {
    // Handle special actions
    if (sceneId === 'restart') {
      this.restartGame();
      return;
    }
    if (sceneId === 'home') {
      this.navigate('home');
      return;
    }

    const sceneData = this.scenes[sceneId];
    if (!sceneData) {
      console.error(`Scene not found: ${sceneId}`);
      return;
    }

    // Convert SceneData to Scene with action functions
    this.currentScene = {
      title: sceneData.title,
      narration: sceneData.narration,
      dialogue: sceneData.dialogue,
      speaker: sceneData.speaker,
      isEnding: sceneData.isEnding,
      isSecretEnding: sceneData.isSecretEnding,
      choices: sceneData.choices?.map(choice => ({
        text: choice.text,
        action: () => this.loadScene(choice.nextScene)
      }))
    };
  }

  private setupKonamiCode(): void {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === this.konamiCode[this.konamiIndex]) {
        this.konamiIndex++;

        if (this.konamiIndex === this.konamiCode.length) {
          this.activateKonamiCode();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  private activateKonamiCode(): void {
    // Trigger secret ending immediately
    this.gameStarted = true;
    this.loadScene('secretEnding_A');
  }

  ngOnDestroy() {
    // Clean up event listener if needed
    document.removeEventListener('keydown', () => {});
  }

}

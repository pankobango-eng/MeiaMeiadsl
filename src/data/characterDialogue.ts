import { LaughterIntensity } from '../types/game';

export interface SpotReactions {
  toes?: string[];
  arch?: string[];
  ball?: string[];
  heel?: string[];
  mid_sole?: string[];
}

export interface CharacterDialogueData {
  characterId: string;
  name: string;
  personaSummary: string;
  laughterProfile: {
    basePitchHz: number;
    pitchVarianceHz: number;
    burstCountRange: [number, number]; // [min, max]
    burstSpacingMs: number;
    staccato: boolean;
    vowelType: 'a' | 'e' | 'i' | 'o';
  };
  reactions: {
    // Tier 3 (Rating 5): Breaking character / kayfabe, genuine surprise, stammering, pleading
    extremeSensitivity: string[];
    // Tier 2 (Rating 3-4): Noticeable laughter, speech slips, physical ticklish reactions
    highSensitivity: string[];
    // Tier 1 (Rating 1-2): Composed, small chuckle, smug teasing
    mildSensitivity: string[];
    // Recovery attempt right after composure was broken
    recovery: string[];
    // When a player picks a weak spot while high-sensitivity targets were available
    ineffectiveChoice: string[];
    // Spot-specific lines
    spotSpecific: SpotReactions;
    // Round flow
    roundStart: string[];
    roundWonFast: string[];
    roundWonClutch: string[];
    roundLost: string[];
    repeatedLosses: string[];
    newHighScore: string[];
    unlockedNext: string[];
    rematch: string[];
  };
  // 2-3 compact paragraphs portraying a playful tickle-fight round loss
  lostRoundNarratives: {
    variationA: string[];
    variationB: string[];
  };
  // Preserved Game-Over Finale Scenes
  gameOverFinale: {
    variationA: [string, string, string];
    variationB: [string, string, string];
  };
}

export const CHARACTER_DIALOGUES: Record<string, CharacterDialogueData> = {
  char_raven: {
    characterId: 'char_raven',
    name: 'Raven',
    personaSummary: 'Cold, calculating goth. Smug, dry sarcasm, controlled taunts until composure breaks.',
    laughterProfile: {
      basePitchHz: 250,
      pitchVarianceHz: 40,
      burstCountRange: [2, 5],
      burstSpacingMs: 135,
      staccato: true,
      vowelType: 'e', // Dry, throaty "heh... heh..."
    },
    reactions: {
      extremeSensitivity: [
        'N-no, wait—ahah! Stop pressing that—I am warning you, do not—hahaha! Ah... composure. That was merely a reflex!',
        'Ah! W-wait—hahaha! Cease that this instant! My instep is entirely off-limits—ah-haha, stop squishing it!',
        'H-hey! Nnh... ahahaha! You found the nerve cluster, damn you! Hands off—let me breathe—hah!',
        'Wait, pause for a second—ahahahaha! Raven, breathe... N-no, you wipe that smug grin off your face!',
        'Agh! Hahaha, no, no, no—not the high arch! Stop digging your fingers in, you fiend—hahaha!',
        'Eep! N-no, don’t pinch there—hahaha! My foot is twitching off the velvet cushion—stop!',
      ],
      highSensitivity: [
        'Ahaha! Right along the curve—stop that! You’re becoming annoyingly persistent with my arch!',
        'Nnh... a direct strike! Hahaha, don’t look so conceited just because my toes curled!',
        'Heh... ahaha! That tickled through my entire sole! You’re playing with fire, darling!',
        'Aha! A shudder right down the instep—stop smiling! I felt that all the way to my ribs!',
        'Wait—hahaha! You’re really trying to make me lose my temper, aren’t you?!',
        'Mmmph—trying to be sneaky along the edge? That tickles far more than I care to admit... haha!',
      ],
      mildSensitivity: [
        'Heh, a little tickle on my heel, but I barely felt that. Did you honestly expect me to flinch?',
        'A polite tap on the heel pad. Barely a tingle. You wasted precious seconds on that?',
        'Pfft, calloused tissue. It tickles slightly, but you’ll have to aim for my arch if you want real squeals.',
        'Heh, cute attempt. My combat boots have given my heels tougher love than that.',
        'A light flutter. Tickles a bit, but I am far from rattled, darling.',
      ],
      recovery: [
        'Ahem. That undignified gasp was merely an involuntary muscle twitch. Do not flatter yourself.',
        'Right. Composure restored. Let us see if you can manage that twice in a row without getting kicked.',
        'I am perfectly composed. That spot simply caught me mid-breath... proceed if you dare.',
        'Wipe that smirk off your lips. I have already regained complete control over my soles.',
      ],
      ineffectiveChoice: [
        'Pfft! You chickened out and tapped my heel when my soft arch was twitching right there?!',
        'Wasting precious seconds on insensitive heel skin while my toes were trembling? What a delightful blunder.',
        'Heh... panic-clicking my calcaneus when you could have made me laugh? A pathetic tactical retreat.',
        'Avoiding my high arch? You’re trembling, darling. Your hesitation cost you the round’s tempo.',
      ],
      spotSpecific: {
        toes: [
          'Ahaha! My toes curled so hard they cramped! Quit wiggling the pads!',
          'Hey—not the tips! Hahaha, stop pinching there, that’s completely unfair!',
          'Eep! You’re making every single toe twitch at once—hahaha, stop!',
        ],
        arch: [
          'The instep—gah! Hahaha, that went straight through my ribcage!',
          'Right in the high arch hollow! You know exactly what you’re doing—ahah!',
          'Ah—no! Not the curve of the arch—that’s impossible to endure without laughing!',
        ],
        heel: [
          'Heh, the heel pad. Solid as granite. You gained nothing from that tap.',
          'Dull calcaneus tap. A mild tickle at best—you won’t break me with that.',
        ],
        ball: [
          'Ahaha! The ball of my foot—don’t press so deep, it makes my toes splay!',
          'Nnh... that ball pad is dangerously sensitive, hands off—haha!',
        ],
        mid_sole: [
          'Right down the center ridge—ah! Hahaha, that tickles all the way to my spine!',
          'Stop pressing the mid-sole! My foot is squirming against my will—ah-ha!',
        ],
      },
      roundStart: [
        'Six selections. Twenty seconds. Let us see how quickly your nerve unravels.',
        'Both soles accessible. Try not to embarrass yourself before I can even laugh at you.',
        'Take a breath. It may be the last quiet moment you enjoy.',
      ],
      roundWonFast: [
        'Hah... breathless already? Swift execution. You managed to outpace my patience.',
        'A brisk, calculated sequence. My soles are still tingling, damn you.',
      ],
      roundWonClutch: [
        'A fraction of a second to spare! Hah... you actually caught my last toe right on the buzzer!',
        'Saved by the buzzer. Pure desperation, but I’ll concede that last tickle landed.',
      ],
      roundLost: [
        'Hah... hah... time expired! Look at you, completely frozen while my arch was right there! Caught your breath yet, or do you need me to show you what real speed looks like?',
        'The clock ceased ticking, darling. You hesitated, and now both of my soles remain undefeated. Admit it—you were too distracted by my laughing to finish.',
        'Phew... hah... finally, the buzzer. My toes were one tickle away from cramping, but you ran out of nerve first. That’s a loss token on your tab.',
      ],
      repeatedLosses: [
        'Another failed attempt? Hah... you’re practically handing victory to me on a silver platter. At this rate, your forfeiture is imminent.',
        'Hahahaha... two blunder rounds in a row? Your hands are trembling, darling. One more mistake and you will face the full consequence of your failure.',
      ],
      newHighScore: [
        'A record tally. You seem almost childishly proud of that number.',
      ],
      unlockedNext: [
        'Ten rounds survived. You’ve earned passage forward, though you won’t find mercy there either.',
      ],
      rematch: [
        'Back for another lesson? Your persistence borders on masochism.',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The final second drained away, and Raven let out a low, breathy chuckle that cut straight through the silence. Before you could pull your hands back from the arena, her slender fingers shot forward with venomous precision, clasping both of your wrists and pulling you off-balance across the dark velvet rug.',
        '"You hesitated," she whispered, her dark eyes glittering with cruel amusement as she pinned your hands flat against the carpet. Without pausing, her free hand slid beneath your shirt, cold fingertips zeroing in on the sensitive hollows beneath your ribs. "I warned you about second-guessing your targets." You gasped, but the gasp immediately dissolved into frantic, helpless giggles as her nails fluttered in a deliberate, agonizingly ticklish cadence.',
        '"Say it," Raven taunted softly, leaning in until her breath brushed your ear while her fingers marched relentless circles into your waistline. "Admit you belong under my heel." You squirmed and kicked, breathless laughter pouring out in uneven wheezes until you finally sputtered out your surrender. Satisfied, Raven released your wrists with a smug, slow smirk, adjusting her velvet cuffs as you lay gasping on the floor.',
      ],
      variationB: [
        'Raven watched your frantic last-second tap fall flat, and a slow, wicked smile curled her lips. "Too slow, my dear," she murmured, gracefully shifting her weight off the chaise and sliding directly into your personal space before you could even catch your breath.',
        'Her hands clamped down playfully on your shoulders, tipping you backward onto the floor cushions. Before you could roll away, her fingers commenced a sharp, relentless assault on both sides of your waist. You erupted into uncontrolled shrieks of laughter, squirming desperately as her deliberate, spider-like touch explored every ticklish crevice. "Look at you thrash," she laughed in a low, teasing hum. "Where did all that digital dexterity go?"',
        'Every twist and buck only seemed to guide her fingers to a more sensitive hollow. Breathless wheezes replaced your laughter, your hands slapping the carpet in undeniable submission. Raven held the tickle barrage for two extra tormenting seconds before stepping back with an arched brow and a dark, triumphant chuckle. "An exquisite loss. Catch your breath; we are far from finished."',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Raven watched the final loss token settle with a cool, languid tilt of her head. Without haste, she shifted her weight across the velvet sofa cushions, curling her knees beneath her skirt and letting out a low, breathy chuckle that echoed softly against the dim bookshelves. "Six tokens," she murmured, tracing a slow line down the instep of her right sole. "You fought admirably against the clock, but rules are sovereign in this sanctum—and forfeiture carries an exacting price."',
        'Before you could scramble backward off the rug, her fingers darted forward with venomous precision. Raven pinned your wrists against the plush carpet with one hand while her slender, cold fingers commenced a merciless, deliberate assault right beneath your ribs. "I warned you about indecision," she taunted in a cool whisper as your breathless laughter burst into frantic gasps. Every time you squirmed to escape, she shifted her touch—skittering across your sides, testing every sensitive crease until you were writhing helplessly on the floor, kicking and giggling in pure surrender.',
        '"Say it," she commanded with an arched brow, her thumb tracing the most agonizingly ticklish hollow just above your hip. Tears of amusement pricked your eyes as you frantically tapped your open palms against the wooden floorboards, wheezing out your complete submission. Only when your voice cracked into a breathless plea did Raven ease her assault, sitting back with a slow, smug smirk as she tucked a dark raven lock behind her ear. "A delightful concession. You may catch your breath... until your next attempt."',
      ],
      variationB: [
        'The clock ceased its ticking, and Raven leaned back against the antique mahogany credenza, studying you like an intriguing specimen. Her silver rings clicked against the armrest as a subtle, amused smile broke her austere expression. "You exhausted your final allowance," she stated softly, her voice smooth and devoid of pity. "Did you truly believe you could test my soles without accepting the inevitable consequence of your failure?"',
        'In one fluid motion she crossed the space between you, catching you by surprise as she tipped you onto the wide chaise lounge. Her agile fingertips immediately locked onto your sides, drumming a relentless, skittering rhythm that instantly melted your composure into helpless, convulsing shrieks. "Where did all that digital dexterity go?" she murmured mockingly, her nails lightly grazing your ribs until you were bucking against the cushions, tears of hysterical laughter streaming down your cheeks.',
        'You thrashed against the upholstery, both hands slapping a frantic, rhythmic surrender against her knees. Raven slowed her strokes to a light, tormenting flutter, hovering right at the verge of another tickle burst. "Tapping out already? How fragile," she whispered, her lips curving with dark triumph. She finally withdrew her hands, allowing you to slump back in breathless exhaustion, your chest heaving in defeat under her cool, triumphant gaze.',
      ],
    },
  },

  char_mika: {
    characterId: 'char_mika',
    name: 'Mika',
    personaSummary: 'Competitive emo. Sarcastic, dramatic, collapses into chaotic giggles when tickled.',
    laughterProfile: {
      basePitchHz: 410,
      pitchVarianceHz: 80,
      burstCountRange: [3, 7],
      burstSpacingMs: 90,
      staccato: false,
      vowelType: 'i', // Sarcastic, teasing "hihihi...!"
    },
    reactions: {
      extremeSensitivity: [
        'Agh! HEY! Wait, time out—ahahahaha! Stop, my toes are literally spazzing out! Okay, okay, that doesn’t count, I’m still winning!',
        'No, no, no, STOP—pfffft-hahaha! That’s completely illegal! Ahahaha, get off my arch, you cheater!',
        'Aaaaack! Hahaha, stop poking there! I swear I’m gonna kick you right in the—ahahaha, MERCY, wait!',
        'Pffft—hahahaha! You found the worst spot, you jerk! I can’t—hahaha, I can’t even breathe right now!',
        'Wait, hold on, my foot is twitching off the screen—ahahahaha! Stop laughing at me, this isn’t funny—ahaha!',
        'Eeeek! Hahaha, no, my ribs hurt from laughing so hard! Quit digging into my instep!',
      ],
      highSensitivity: [
        'Whoa, hey! Ahaha! You actually aimed for the arch?! That was ridiculously ticklish, what the hell!',
        'Ack! Right in the middle! Hahaha, don’t look so proud of yourself just because I squeaked!',
        'Haha, rude! That reflex shot straight up my shin! You did that on purpose!',
        'Oof! A five-star tickle burst. My toes are literally curling in protest right now—ahaha!',
        'Haha, okay, okay, not bad! But my rhythm is still way tighter than yours!',
        'Gah—pfft! Stop hitting that spot! That sent a massive tickle wave through my heel!',
      ],
      mildSensitivity: [
        'Haha, the heel? Are you serious?! My combat boots gave me thicker skin than that!',
        'Pfft, heel poke! That was like ten whole points. Are you trying to lose on purpose?',
        'A tiny baby tap on the heel cushion. Zero tickles, total waste of time, dude.',
        'Meh! Felt like a mosquito landed on my heel. Try aiming for a real nerve next time!',
        'Heh, cute tickle, but that heel is made of iron. You’re gonna have to do way better!',
      ],
      recovery: [
        'Okay! That squeak never happened! My mic just clipped, that’s all! Come at me!',
        'I’m totally fine! That was tactical laughter! You’re still way behind on the setlist!',
        'Phew... okay, reset! Don’t think you broke my defense, pal—I was just stretching!',
        'Ha! You think that rattled me? Please! I survive mosh pits tougher than that!',
      ],
      ineffectiveChoice: [
        'Wait, you clicked THAT when my arch was wide open?! What is that amateur logic?!',
        'Hahaha, what a massive blunder! You just threw away three whole seconds for pocket change!',
        'Are your thumbs having an existential breakdown?! That was the worst spot on the board!',
        'Pfft! You saw my arch twitching and you ran to my calloused heel? Total chicken move!',
      ],
      spotSpecific: {
        toes: [
          'Ahahaha! Not the pinky toe, you monster! Stop wiggling them!',
          'Ack! Toe pad tickle! They’re curling up like little fists—hahaha!',
          'Eeeep! The big toe cushion! That tickles like absolute crazy!',
        ],
        arch: [
          'The arch—NOOO! Hahaha, that’s my kryptonite, get off it!',
          'Gah! Instant reflex kick right from the instep! You jerk—ahaha!',
        ],
        heel: [
          'Heel tap! Barely felt a buzz. Try harder, rookie!',
          'Haha, tough leather on that heel! You got zero reaction from me!',
        ],
        ball: [
          'Whoa! Right on the ball of my foot! My toes spread right out on reflex—haha!',
          'Ack, that ball pad is so ticklish! Hands off my soles!',
        ],
        mid_sole: [
          'Center sole strike?! Hahaha, that tickled right up through my stomach!',
          'Quit digging into the mid-sole, you menace! Hahaha!',
        ],
      },
      roundStart: [
        'Alright, track is live! Let’s see if those sluggish thumbs can keep up with my tempo!',
        'Don’t blink, don’t snooze, and definitely don’t expect me to hold my feet still!',
        'Ten rounds in the setlist. Think you’ve got the stamina to headline this gig?',
      ],
      roundWonFast: [
        'Whoa, okay, speed demon! Where was that burst of energy in round one?!',
        'Damn, that was actually pretty fast! Don’t let it blow up your ego though!',
      ],
      roundWonClutch: [
        'Zero-point-one seconds?! Are you kidding me?! My heart almost stopped for you!',
        'You literally scraped by by a fingernail! Ugly buzzer-beater, but fine!',
      ],
      roundLost: [
        'BZZT! Time’s up, superstar! Ahahaha! You spent four whole seconds staring at my wiggling toes and froze! That’s one loss token on your tab!',
        'Phew... hah! Saved by the bell! My arches were about to give out, but you choked on the clock! Take a seat, loser!',
        'Out of time! Hahaha! Where did all that fast-finger confidence go, huh? You choked under pressure!',
      ],
      repeatedLosses: [
        'Another choke?! Hahaha, are you trying to give me a free win? One more and you’re buying backstage passes for life!',
        'Whoa, two tokens already?! Your reflexes are completely lagging! Catch up before this run crashes and burns!',
      ],
      newHighScore: [
        'Wait, you shattered the record?! Okay, I gotta admit, that was pretty sick.',
      ],
      unlockedNext: [
        'Set complete! Ten whole rounds in the bag. You actually survived my playlist!',
      ],
      rematch: [
        'Encore time! Don’t think I’m going easy on you just because we played already!',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The round buzzer blared, and Mika erupted into an immediate, victorious cackle. "BZZZT! Time’s up, loser! The reigning champion takes the set!" She dropped her acoustic guitar onto the stand and scrambled across the carpet with wild, dramatic energy, pouncing right onto your midsection before you could scramble to your feet.',
        '"You know the penalty for letting the clock run out on my stage!" she teased, her spiked bracelets clicking together as her nimble fingers dove straight for your armpits and ribs. You let out an explosive shriek of laughter, thrashing like crazy as she launched a furious, rhythmic drum solo right into your most ticklish spots. "Where’s that lightning reflex now, huh?! Come on, show me those fast hands!"',
        'Tears of hysterical hilarity streamed down your face as you kicked and squirmed against the floorboards. "Mika, tap! Tap out, mercy!" you wheezed between convulsive bursts of giggles. Mika held the tickle attack for two extra beats before tumbling backward onto the beanbag chair, breathless and laughing ecstatically. "Aww yeah! Flawless victory! Best encore ever!"',
      ],
      variationB: [
        'Mika pointed an accusatory, grinning finger straight at your hands. "Choke! Total fourth-quarter meltdown!" she crowed, tumbling off her stool and tackling you into the corner cushions in a whirlwind of striped socks and chaotic energy.',
        'Her fingers fluttered relentlessly along your waistline, zeroing in on the spots she knew would make you fold in half. "You spent five whole seconds staring at my feet while the clock chewed you up!" she teased loudly over your desperate, howling laughter. Every time you tried to catch enough breath to speak, she shifted her tickle attack to your ribs, sending you into fresh spasms of helpless squealing.',
        'You slapped the floor three loud times in total, unvarnished surrender: *Thud! Thud! Thud!* Mika instantly pulled back, giving you a smug, two-finger salute with an enormous grin. "Surrender registered, superstar! Take five and grab some water—you look like a boiled tomato!"',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Mika pumped both fists in the air the instant the sixth loss token struck the counter, tossing her fringe back with an exuberant shriek of laughter. "That is SIX, baby! Game over! The grand champion claims her spoils!" She scrambled across the rug with wild, energetic momentum, her spiked wristbands jingling as she dropped straight down onto your chest before you could even sit upright.',
        '"You know the house rules for a total loss!" Mika grinned wickedly, her fingers already dancing into a frenzied drum solo directly into your armpits and waistline. You let out a surprised howl and tried to double over, but she was entirely too quick, digging her thumbs into your sensitive sides with playful ferocity. "Where’s that lightning reflex now, huh?! Come on, show me those fast fingers!" Every wriggle you made only earned another burst of relentless teasing.',
        'Helpless shrieks echoed through the room as you flailed your arms, finally smacking both hands rapidly against the carpet in desperate, undeniable surrender. "Tap! I tap out! Mercy!" you wheezed through tears of uncontrollable laughter. Mika held the tickle barrage for two more agonizingly funny seconds before collapsing backward onto the cushions, panting and laughing victoriously. "Phew! Best workout of the day. You’re definitely buying snacks next time!"',
      ],
      variationB: [
        'Mika shook her head with dramatic theatrical flair, pointing a finger directly at the final loss counter. "That’s all she wrote, superstar! Curtain call! Time for the championship celebration, and guess who’s the centerpiece?!" She lunged forward with a delighted grin, tackling you right onto the beanbag chair before you had a chance to scramble away.',
        'Her fingers went straight for your most vulnerable tickle spots—fluttering across your ribs like frantic bass guitar strings. You instantly dissolved into hysterical gasps, kicking your legs and twisting desperately while Mika giggled uncontrollably above you. "Nope, no escaping! You lasted nine whole rounds just to crash out at the finish line! You gotta pay the full penalty fee!" she cheered, her touch dancing relentlessly across your midsection.',
        'You thrashed against the upholstery, both hands slapping a frantic, rhythmic surrender against her knees. Mika slowed her strokes to a light, tormenting flutter, hovering right at the verge of another tickle burst. "Tapping out already? How fragile," she whispered, her lips curving with dark triumph. She finally withdrew her hands, allowing you to slump back in breathless exhaustion, your chest heaving in defeat under her cool, triumphant gaze.',
      ],
    },
  },

  char_ivy: {
    characterId: 'char_ivy',
    name: 'Ivy',
    personaSummary: 'Innocent and oblivious. Warm, sunny, genuine surprises that sound teasing.',
    laughterProfile: {
      basePitchHz: 360,
      pitchVarianceHz: 55,
      burstCountRange: [3, 6],
      burstSpacingMs: 115,
      staccato: false,
      vowelType: 'a', // Warm, sunny, gentle "hahaha~"
    },
    reactions: {
      extremeSensitivity: [
        'Oh goodness—eep! Ahahaha! Wait, wait, sweetie, my foot jumped right into the air! Hehe, that tickles so much it makes my ears warm!',
        'Oh my stars—ahahahaha! Stop, stop, I can’t breathe! Hehe, you found the most delicate little spot on my whole foot!',
        'Eeeek! Ahaha, no, please, give me one second! My toes are squirming like little caterpillars—hehehe!',
        'Oh goodness me! Hahaha! That tickled all the way up through my tummy! You’re such a sneaky little bee!',
        'Ahahaha! Mercy, mercy! Hehe, I didn’t know my arch could even jump that high! Look at me blushing!',
      ],
      highSensitivity: [
        'Hehe! That was so delightfully tickly! My soles are tingling like fresh clover!',
        'Oh! That sent a little jolt right up my heel! You’re getting so good at finding the soft parts!',
        'Ahaha, goodness! That really made my foot twitch! You have very clever fingers, friend!',
        'Hehehe, tickle tickle! My instep feels like it’s dancing in a warm summer shower!',
      ],
      mildSensitivity: [
        'Hehe, my heel? That spot walks barefoot on river stones all morning! It barely felt that at all!',
        'A tiny little pat on the heel pad. That was like a leaf falling on my foot, silly!',
        'Oh, that spot is quite sturdy! Did you want to try somewhere a little softer?',
        'Hehe, sleepy heel! You spent so much time just to give my callus a pat!',
      ],
      recovery: [
        'Phew! Hehe, goodness, I’m so sorry for squealing like that! I’m all composed now, I promise!',
        'Hehe, my heart was fluttering so fast! Let me tuck my toes back under my hem... okay, ready!',
        'Oh dear, did I jump too high? Hehe, I’m holding my foot perfectly still now, pinky promise!',
      ],
      ineffectiveChoice: [
        'Oh, honey... why tap the tough heel when my soft arch was right there asking for a little tickle?',
        'Hehe, did your fingers get lost? That spot was so sleepy compared to the rest!',
        'Aww, you spent three whole seconds on my pebble-sturdy heel! Don’t worry, we all slip up!',
      ],
      spotSpecific: {
        toes: [
          'Hehehe! My toes are wiggling like grass in the breeze! Stop tickling the tips!',
          'Eep! The little toe pads! That’s such a soft, sunny spot to press—hehehe!',
          'Oh goodness, my little toes are curling right up! Stop, silly!',
        ],
        arch: [
          'The hollow arch—oh goodness! Ahaha, that made my whole ankle bounce!',
          'Right in the instep! Hehe, that’s where all my secret giggles live!',
          'Ahahaha! The high arch tickles like butterflies in my tummy!',
        ],
        heel: [
          'Heel tap! Barefoot forest walks make that spot tough as oak bark!',
          'Hehe, barely a tingle on my heel. Try the softer clover patches next!',
        ],
        ball: [
          'Oh! The ball of my foot! Hehe, that tickled like warm sunshine on fresh dew!',
          'Eeeep! The soft front pad! My toes spread right out when you press there!',
        ],
        mid_sole: [
          'Right down the middle! Hehehe, that tickles all the way to my shoulders!',
          'Oh my goodness, the center sole! You’re such a sneaky little gardener!',
        ],
      },
      roundStart: [
        'Ready whenever you are, friend! Just breathe gently and follow the rhythm of the soles.',
        'Let’s have a wonderful round together! I promise to hold my feet as steady as I can.',
        'Six little presses to go! Take your time, but remember the little timer is running!',
      ],
      roundWonFast: [
        'Oh wow, look at you! That was so quick and light, just like a summer breeze!',
        'Goodness, you cleared that before I could even catch my breath! Wonderful job!',
      ],
      roundWonClutch: [
        'Oh, goodness me! Just a single little tick left on the clock! My heart fluttered!',
        'You made it right as the bell rang! How delightfully exciting that was!',
      ],
      roundLost: [
        'Oh goodness, the little chime rang! Hehe... my soles can finally stop squirming for a moment! Did you get all dizzy watching my feet dance?',
        'Hehe, time is up, sweetie! Look at you catching your breath! I guess my little tickle spots were too tricky for you this round!',
        'The timer reached zero! Oh, what a relief... my arch was just about to burst into giggles, but you let the clock run out first!',
      ],
      repeatedLosses: [
        'Oh dear, another little loss token! Hehe, don’t worry, friend, even the busiest little bees stumble sometimes!',
        'Two tokens already? Hehe, your hands look so flustered! Take a deep breath and let’s try one more time together!',
      ],
      newHighScore: [
        'Oh, hooray! A brand new highest score! I feel like planting sunflowers in celebration!',
      ],
      unlockedNext: [
        'All ten rounds completed! You’ve tended this entire garden so beautifully!',
      ],
      rematch: [
        'Another turn? How lovely! Playing together is always the best part of my afternoon.',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The timer chimed its final note, and Ivy blinked in soft, delighted realization. Her warm hazel eyes lit up with pure childlike enthusiasm. "Oh goodness, the little clock reached zero! That means my soles kept their secret, doesn’t it?" She leaned forward on her woven grass mat, beaming with an expression of such innocent joy that you didn’t realize she was cornering you until her hands were already hovering.',
        '"You worked so terribly hard, but you know our little garden rule for a lost round!" she giggled warmly, her fingertips descending with butterfly-light speed right into your waistline. The contrast between her serene demeanor and the sheer, electric ticklishness of her touch caused you to instantly collapse onto the cushions, rolling and wheezing in helpless hysterics. "Hehe! Look at your smile! Your giggles sound like little meadow larks!"',
        'Her fingers fluttered across your ribs with sweet, unhurried persistence, utterly oblivious to your desperate squirming. "Ivy—wait, hehe, tap out! I yield!" you managed to gasp between convulsions of laughter. Ivy gasped softly in realization, clapping her hands together with radiant satisfaction. "Oh, you tapped out! What a wonderfully happy game. Now take a nice deep breath while I fetch us some fresh mint water!"',
      ],
      variationB: [
        'Ivy watched the timer cease with a gentle, affectionate chuckle. "Oh dear, the clock ran down while you were deciding! I suppose that means it’s my turn to share some tickles!" Before you could protest, she scooted across the linen rug with astonishing nimbleness.',
        'Her soft, warm fingers went straight to your sides, drumming a gentle, fluttering rhythm that instantly shattered whatever dignity you had left into helpless, snorting giggles. "You look so cute when you try to hold your breath!" Ivy cheered happily, her fingertips dancing across your ribs as you wriggled frantically on the floor. "See? It’s completely impossible to stay serious when we’re playing!"',
        'Out of breath and thoroughly defeated, you slapped the side of the sofa in rapid, joyful surrender. Ivy smiled warmly, easing her hands back and patting your cheek with sunny reassurance. "There, there! You did so well, friend. Let’s see what happens in the next round!"',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Ivy tilted her head in gentle surprise as the chime announced the final loss token. Her warm hazel eyes widened with genuine sympathy, though a tiny, playful dimple gave away her secret amusement. "Oh dear... that was your sixth token, wasn’t it?" she murmured sweetly, tucking her linen dress around her ankles as she crawled across the wool rug toward you. "You worked so very hard, but a promise is a promise, and you promised we would play the celebration game if you didn’t make it."',
        'Before you could protest that you never explicitly agreed to that, Ivy’s gentle hands slid around your waist. Her fingers fluttered with surprisingly expert lightness, dancing across your ribs like breezy dandelion fluff. You gasped, instantly folding inward with helpless, rolling laughter. "Hehe! Look at you giggle!" Ivy beamed innocently, her touch skittering up to your underarms and down your sides with cheerful, effortless persistence. "Your laugh sounds like little bells in the garden!"',
        'You were writhing completely out of breath on the carpet, tears streaming from your eyes as you desperately slapped both hands in a rapid rhythm against the floor. "Tap! Ivy, tap out! I surrender!" you managed to squeak between convulsive giggles. Ivy gasped in soft realization and immediately pulled her hands back to her chest, looking wonderfully satisfied. "Oh, you tapped out! You did so well, friend. Now let’s share some warm herbal tea while you catch your breath!"',
      ],
      variationB: [
        'Ivy watched the timer cease with a soft, affectionate sigh. "Oh, the little clock stopped at zero again. That means my soles won today, doesn’t it?" She smiled radiantly, kneeling beside you with an innocent, open-hearted expression that made what came next entirely unexpected.',
        'Without the slightest hint of aggression, she reached out and began tickling your ribs with light, fluttering fingertips. The contrast between her peaceful demeanor and the overwhelming tickle tickle caused you to burst into uncontrollable hysterics on the floor cushions. "You were so very brave with all those tricky targets," Ivy remarked casually as you squirmed and wheezed beneath her gentle, unrelenting tickle barrage. "It’s only natural for your body to let out all that silly tension!"',
        'Desperate to save your remaining lung capacity, you slapped the side of the sofa with frantic, loud pats. "Mercy! I yield! Tap out!" you wheezed. Ivy let out a sweet, delighted laugh and patted your shoulder reassuringly. "Goodness, look at your rosy cheeks! What a wonderful, happy game. You’re always welcome to try again whenever you like!"',
      ],
    },
  },

  char_celeste: {
    characterId: 'char_celeste',
    name: 'Celeste',
    personaSummary: 'Sweet but mischievous coquette. Coy, giggly, singsong teasing.',
    laughterProfile: {
      basePitchHz: 530,
      pitchVarianceHz: 90,
      burstCountRange: [4, 8],
      burstSpacingMs: 80,
      staccato: false,
      vowelType: 'i', // High, melodic, bubbly "hee-hee-hee~!"
    },
    reactions: {
      extremeSensitivity: [
        'Eeeek! N-no, not there—hihihi! Stop, stop, you’re tickling the ribbon right off my foot! Ahahaha, you naughty sneak!',
        'Ahahaha! Wait, wait, darling, my toes are curling so hard—hihihi! That’s totally unfair, you caught me mid-breath!',
        'Nooooo—ahahahaha! Stop it, stop it, stop it! Tee-hee! I’m crying real glitter tears right now, pause for a second!',
        'Eeeep! Hahaha, you found my secret tickle spot! My ankle just did a whole pirouette—hihihi!',
        'Ahaha, mercy, cutie! Stop pressing that hollow, I’m gonna lose all my composure—tee-hee-hee!',
      ],
      highSensitivity: [
        'Tee-hee! That gave me full goosebumps! Did you see how high my heel kicked?',
        'Ooooh, tickle tickle! My arch feels like it’s being tickled with pink feathers!',
        'Eeeek! You’re such a cheeky darling! That was way too direct on the instep!',
        'Hihihi! Stop giving me such funny shivers! You’re definitely enjoying this too much!',
      ],
      mildSensitivity: [
        'Aww, the heel? How sleepy, darling! You spent three whole seconds on a boring tap!',
        'Hehe, that barely made my ribbons flutter! You’re playing with dollhouse points, silly!',
        'A little heel poke. Did you get scared of really tickling me?',
        'Tee-hee, that was so gentle it felt like a soft kiss on my shoe!',
      ],
      recovery: [
        'Ahem! A lady is always composed... tee-hee, even if her toes are still tingling! Proceed, sweetie~',
        'Tee-hee! That little squeak was just my enthusiasm, obviously! I’m totally in control again!',
        'Phew! Okay, ribbons adjusted, pose restored! Don’t you dare think you conquered me, cutie pie!',
      ],
      ineffectiveChoice: [
        'Oh honey, no! You pressed the heel when my soft arch was practically begging for a tickle?!',
        'Tee-hee! What a clumsy darling! You traded all your time for pocket change!',
        'Were you staring at my pink ribbons? You completely missed the sensitive spot!',
      ],
      spotSpecific: {
        toes: [
          'Hihihi! You’re tickling my little toe pads! They’re wiggling like mad!',
          'Eeeek! Not the big toe cushion, sweetie! That tickles like crazy—hihi!',
          'Aww, you’re playing with each little pink toe! Tee-hee, that tickles so much!',
        ],
        arch: [
          'The pink arch curve—ahahaha! That sent sparkles straight up my spine!',
          'Right in the delicate hollow! Tee-hee, you know all my weaknesses!',
          'Eeeep! The high arched curve is totally helpless! Stop pressing it—hihihi!',
        ],
        heel: [
          'Heel tap! Cute, but sturdy as a porcelain doll. Try harder, darling!',
          'Hehe, barely a flutter on my heel. Aim for the soft ribbons next time!',
        ],
        ball: [
          'Ooooh! The ball pad under my toes! Tee-hee, that sent a little shiver up my ankle!',
          'Hihihi! That spot makes me want to dance on tiptoe! Stop tickling it, cutie!',
        ],
        mid_sole: [
          'Tee-hee! Center sole press! My whole foot arched right off the cushion!',
          'Eeeek! That tickled all the way to my tummy ribbons—ahahaha!',
        ],
      },
      roundStart: [
        'Round start! Ready to play with my toes, cutie pie? Don’t keep a girl waiting~',
        'Six little taps to win my heart... or at least survive to the next round, hehe!',
        'Soft pink ribbons, ticklish soles, and a ticking clock. Good luck, darling!',
      ],
      roundWonFast: [
        'Oh my goodness, you zipped through that like Cupid’s arrow! Color me impressed!',
        'Look at those fast fingers! You’re getting dangerously good at this, handsome~',
      ],
      roundWonClutch: [
        'Eeeek! Zero seconds on the clock! You like living on the edge, don’t you?',
        'My heart went pitter-patter right at the end! You saved it just in time!',
      ],
      roundLost: [
        'Tee-hee! Time is up, darling! Did my little pink toes distract you too much? Don’t worry, losing to a girl like me is a privilege!',
        'Aww, ran out of seconds, cutie pie? Hahaha! Look at you pouting! That’s one little loss token for your collection~',
        'Chime went off! Phew... tee-hee! My arches were one flutter away from surrender, but you froze up first, handsome!',
      ],
      repeatedLosses: [
        'Uh oh, another loss token! Tee-hee, are you losing on purpose just to hear me giggle more?',
        'Two strikes already, handsome! You better focus those cute eyes, or game over is coming fast!',
      ],
      newHighScore: [
        'A brand new high score! Aww, you’re spoiling me with all these glittering points!',
      ],
      unlockedNext: [
        'Ten rounds cleared! You swept me off my feet, literally! You’re a certified charmer!',
      ],
      rematch: [
        'Back for more kisses and tickles? I knew you couldn’t stay away from me for long~',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The timer expired with a soft, cheerful chime, and Celeste let out a delighted squeal, clapping her hands together as her pink hair ribbons fluttered. "Time’s up, cutie pie! And that means Celeste gets her sweet, sweet prize!" Before you could withdraw, she crawled across the plush velvet rug, beaming with sugary, mischievous triumph.',
        'Her delicate hands pounced onto your ribs with lightning-fast, feather-light flutters. The sensation was so intensely, playfully ticklish that you folded instantly in half, screaming with breathless laughter. "Tee-hee! Look at you squirm, handsome!" she giggled in a sing-song melody, her manicured fingers dancing up your sides and into your waistline. "Where did all that confident swagger go? You’re completely helpless right now!"',
        'You thrashed against the floor cushions, laughing until your eyes teared up and your voice gave out entirely. Frantically, your palm struck the fluffy rug: *Tap! Tap! Tap!* "I give up, Celeste! You win!" you wheezed. Celeste giggled victoriously, giving your flushed cheek a gentle, affectionate pat as she sat back gracefully on her heels. "Aww, good boy! That was so much fun, darling!"',
      ],
      variationB: [
        'Celeste rested her chin on her hands with an exaggerated, coy pout. "Oh darling, the big mean clock ran down while you were hesitating! You know what that means, don’t you?" Her innocent expression melted into pure, sparkling mischief as she lunged forward.',
        'Her fingers found the most agonizingly sensitive spots along your waist, tickling with relentless, breathy giggles. You erupted into uncontrolled hysterics, rolling across the pillows while Celeste cheerfully kept pace, her soft giggles harmonizing with your gasps. "Tee-hee! You’re so wonderfully ticklish! I could keep you giggling like this all afternoon!"',
        'With zero breath left to defend yourself, you tapped out frantically against her knee. Celeste giggled triumphantly, blowing you a sweet, playful kiss as she finally let you catch your breath. "Surrender accepted, cutie pie! Ready to try again?"',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Celeste clapped her manicured hands together with a delighted squeal, the pastel pink ribbons in her hair fluttering as she bounced on her velvet footstool. "Six tokens! Oh you poor, sweet darling, you lost!" Her eyes sparkled with mischievous glee as she crawled across the plush pastel rug, smiling sweetly like an angelic cat cornering a mouse.',
        '"You know what the penalty is when a girl wins fair and square, don’t you?" she cooed in a sing-song voice, pouncing forward before you could even sit up. Her delicate fingers zeroed in on your sides and ribs with sparkling, bubbling energy, tickling with lightning-fast flutters that had you screaming with laughter within half a second. "Tee-hee! Look at you squirm! Aren’t you just the most adorable loser ever?!"',
        'Every time you tried to catch your breath, Celeste shifted to your waistline with fresh, teasing giggles. "Say please, cutie! Tell me I’m the ultimate champion!" she chirped. Gasps and frantic chuckles choked your throat as you slapped your palms against the fluffy rug three loud times: *Tap! Tap! Tap!* "I give up! You win, Celeste!" you wheezed. Celeste giggled triumphantly, giving your cheek a sweet, affectionate pat as she finally let you collapse back, completely flushed and breathless.',
      ],
      variationB: [
        'Celeste rested her chin in her hands, fluttering her eyelashes with theatrical, coy pity. "Oh darling, that’s six loss tokens. The clock was so mean to you today!" But the mischievous smile breaking across her lips gave her true intentions away instantly.',
        'In a flurry of silk and ribbons, she pinned your arms down, her fingers skittering along your ribcage with sweet, bubbly ferocity. "Nobody loses to Celeste without paying the tickle tax!" she sang out as your breathless laughter erupted through the room. She knew exactly which spots made you kick and twist, laughing her bright, musical laugh as you squirmed helplessly under her playful hold.',
        'You couldn’t form words between convulsions of giggles, so you slapped the nearest cushion in unmistakable, rapid surrender. Celeste eased her hands into a gentle victory hug, giggling warmly into your shoulder. "Aww, you tapped out! You’re such a good sport, darling. Maybe next time you’ll be fast enough to escape me~"',
      ],
    },
  },

  char_jade: {
    characterId: 'char_jade',
    name: 'Jade',
    personaSummary: 'Bold punk provocateur. Brash, irreverent, breaks into roaring laughter when overwhelmed.',
    laughterProfile: {
      basePitchHz: 310,
      pitchVarianceHz: 65,
      burstCountRange: [2, 6],
      burstSpacingMs: 105,
      staccato: true,
      vowelType: 'a', // Hearty, brash, roaring "bwahaha!"
    },
    reactions: {
      extremeSensitivity: [
        'Bwahaha! Holy crap, wait—hahaha! Get off that spot, you bastard, that’s cheating! Ahaha... whew, okay, I’m good, bring it on!',
        'GAH! Hahaha, no way, stop digging into the arch—BWAHAHA! My whole leg is going crazy right now, stop!',
        'Wait, pause, PAUSE! Hahaha! You little punk, that tickles so hard my ears are ringing! Ahahaha!',
        'Pffft—hahahaha! Holy hell, that was right on the raw nerve! Back off, back off—ahaha!',
        'No, no, no—BWAHAHA! You found the one spot that actually breaks me! Stop laughing, damn it—hahaha!',
      ],
      highSensitivity: [
        'Whoa! Full reflex kick! My heel nearly smacked the ceiling! Good hit, punk!',
        'Haha, you bastard! That was dead center on the nerve line! Pretty solid shot!',
        'Damn, that was sharp! You’re actually bringing some real heat today!',
        'Haha, okay, okay, not bad! You managed to make me jump, enjoy your little victory!',
      ],
      mildSensitivity: [
        'Haha! The heel?! What are you doing, trying to chip through leather boots?!',
        'Pfft, heel tap! That was weak as hell! My skateboard takes harder beatings than that!',
        'You burned three seconds on a rock-solid heel? Are your fingers broken, pal?',
        'Ten points?! Come on, I’m trying to have a real brawl here, not a tea party!',
      ],
      recovery: [
        'Whew! Okay, that squeak was just a vocal warm-up! I’m back in the ring, let’s go!',
        'Haha, nice try, punk! You got one lucky hit, but I’m still standing tough!',
        'Pffft, think that took me out? I’ve taken stage dives harder than that! Bring it!',
      ],
      ineffectiveChoice: [
        'Are you blind or just scared?! You dodged the sensitive arch for THAT garbage?!',
        'Hahaha, what a massive choke! You literally picked the toughest spot on the board!',
        'Bwahaha! Panic clicking at its finest! My grandma targets better than that!',
      ],
      spotSpecific: {
        toes: [
          'Bwahaha! Not the toe pads, you sneak! They’re kicking like a double-bass pedal!',
          'Haha, quit wiggling my toes! That’s ridiculously ticklish—stop!',
          'Holy crap, that toe tap made my whole calf spasm! Bwahaha!',
        ],
        arch: [
          'The arch—DAMN IT! Hahaha, that went straight through my soul!',
          'Right in the high arch hollow! Bwahaha, you know all the cheap tricks!',
          'GAH! Get your fingers out of my arch, that’s an illegal move! Hahaha!',
        ],
        heel: [
          'Heel tap! Solid granite, baby. You wasted three seconds for nothing!',
          'Haha, calloused heel! That gave me zero tickles and cost you half the round!',
        ],
        ball: [
          'Whoa! Right on the ball of my foot! That sent an electric jolt straight up! Bwahaha!',
          'Haha, pressing the foot pad?! That’s where all the spring lives—hands off!',
        ],
        mid_sole: [
          'Right down the center! Bwahaha! That tickled so hard my foot bucked off the stool!',
          'Quit digging into the mid-sole, punk! Hahaha!',
        ],
      },
      roundStart: [
        'Round start, let’s make some noise! Don’t hold back, hit me with your best shots!',
        'Ten rounds in the mosh pit! Let’s see if you’ve got the guts to finish!',
        'Timer is running, boots are off, game is on! Move those hands!',
      ],
      roundWonFast: [
        'Hell yeah! Now THAT was a blitz! That’s what I’m talking about!',
        'Damn, you shredded that round! Clean, fast, and loud! Good job!',
      ],
      roundWonClutch: [
        'Holy crap, on the buzzer! That was down to the wire, you lucky bastard!',
        'Talk about a buzzer beat! Barely squeezed that out before the bell!',
      ],
      roundLost: [
        'TIME! Down goes the challenger! Bwahaha! Look at you, out of breath and out of time! That’s what happens when you hesitate against the champ!',
        'Buzzer blared, punk! My soles survived the round, and you took a fat L on the scoreboard! Catch your breath, you’ll need it!',
        'Phew! Hahaha... man, my arches were on fire, but you couldn’t finish the job! That’s one loss token on your tab!',
      ],
      repeatedLosses: [
        'Another choke in the clutch?! Bwahaha! You’re racking up loss tokens like bowling pins! One more and it’s total knockout!',
        'Two rounds lost back-to-back?! Come on, wake up! Where’s that fighting spirit?!',
      ],
      newHighScore: [
        'NEW RECORD! Hell yeah, you smashed it! Crack a cold one for that score!',
      ],
      unlockedNext: [
        'Ten rounds conquered! You survived the pit with me, respect where it’s due!',
      ],
      rematch: [
        'Back for another round of punishment?! I love your attitude, let’s rock!',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The buzzer sounded with a sharp blare, and Jade instantly threw her head back in a roaring, triumphant laugh. "TIME! Down goes the challenger! Step into my ring, take an L, pay the price!" In one explosive leap, she vaulted across the floor cushions and tackled you flat on your back.',
        'Her calloused, energetic hands dug straight into your ribs like a two-stroke engine kicking into high gear. You let out an involuntary shriek of laughter, thrashing desperately as she unleashed a furious punk-rock tickle solo into your sides and waist. "Come on, where’s that cocky swagger now, punk?! Show me some fight!" she hollered over your breathless, howling laughter.',
        'Tears of sheer hilarity streamed down your face as Jade tickled you into total breathless delirium. With zero stamina remaining, you slammed your flat palm three times hard against her denim knee: *SMACK! SMACK! SMACK!* "TAPPING! I TAP OUT, JADE! MERCY!" Jade roared with laughter, throwing both arms up like an undefeated champion. "And THAT’S how the champ defends her belt! Good hustle though, kiddo!"',
      ],
      variationB: [
        'Jade slammed both palms down on her knees with an ecstatic grin as the clock expired. "Total technical knockout! You let the round clock eat you alive!" Before you could even sit upright, she threw her arms around your shoulders and wrestled you onto the carpet in a flurry of laughter.',
        'Her fingers went straight for your most sensitive tickle spots, drumming a wild, relentless beat into your midsection. The sheer speed of her attack made defense impossible; you were reduced to convulsive, gasping shrieks within two seconds. "You really thought you could stall against me?! In your dreams, buddy!" she yelled gleefully.',
        'Gasping for air, you slapped the floorboards in frantic, undeniable surrender. "Alright, tap out accepted!" Jade laughed, tumbling back onto the floor beside you with an exuberant grin. "Damn, that was a blast! You’re a tough bastard, I’ll give you that!"',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Jade threw her head back and let out a roaring, triumphant laugh that rattled the posters on her wall as the sixth token locked into place. "THAT’S IT! Game over, kiddo! Down goes the challenger!" She vaulted over the back of the sofa, boots long tossed aside, and landed squarely on top of you with a grin full of pure punk irreverence.',
        '"You stepped into my ring, you took the hits, and now it’s time to pay the champion’s toll!" she hollered. Without warning, her calloused, energetic hands dug right into your ribs like a two-stroke engine kicking into gear. You let out an explosive shriek of laughter, thrashing like a landed trout as her fingers attacked your sides, hips, and underarms with gleeful, relentless stamina. "Come on, where’s that swagger now?! Show me some fight!"',
        'Tears of sheer, uncontrolled hilarity poured down your face as Jade tickled you into total breathless delirium. With zero dignity left, you slammed your flat palm three times hard against her denim knee: *SMACK! SMACK! SMACK!* "TAPPING! I TAP OUT, JADE! MERCY!" Jade roared with laughter, lifting her hands in victory like an undefeated wrestler. "And THAT’S how it’s done! Good hustle though, punk—you lasted way longer than most!"',
      ],
      variationB: [
        'Jade slammed both palms down on her knees and pointed right at the scoreboard with an ecstatic grin. "Blow the whistle, ref! Total knockout! Pack your bags, because you just got schooled!" She didn’t wait half a second before tackling you onto the rug in a flurry of laughter.',
        'Her fingers went straight for your most sensitive spots, drumming a wild punk-rock beat into your waistline. The sheer speed of her attack was completely impossible to defend against, reducing you to gasping, kicking hysterics within seconds. "You really thought you could outlast me in a reflex battle?! In your dreams, buddy!" she yelled over your convulsive shrieks, grinning ear to ear.',
        'With your lungs completely out of air, you frantically slapped the floorboards in rapid-fire surrender. "Alright, alright, tap out accepted!" Jade laughed, tumbling back onto the floor beside you with an exuberant fist pump. "Damn, that was fun! You’re a tough bastard, I’ll give you that much!"',
      ],
    },
  },

  char_sofia: {
    characterId: 'char_sofia',
    name: 'Sofia',
    personaSummary: 'Refined, articulate, patient. Elegant phrasing breaks into strained giggles when tickled.',
    laughterProfile: {
      basePitchHz: 285,
      pitchVarianceHz: 45,
      burstCountRange: [2, 5],
      burstSpacingMs: 125,
      staccato: true,
      vowelType: 'e', // Velvety, refined, polite "ah-ha-ha..."
    },
    reactions: {
      extremeSensitivity: [
        'Good heavens—ah-ha! Stop that this instant—hahaha! I demand you—nnh, heavens, my toes... Ahem. Let us pretend that unseemly squeak never occurred.',
        'N-no, wait—ahahahaha! Sofia, breathe... Heavens, that is profoundly ticklish! Release my instep at once—hah!',
        'Ah! W-wait—hahaha! My composure is—nnh, ahahaha! Stop that deliberate tickling, you dreadful scoundrel!',
        'Oh, heavens above! Hahaha! My foot kicked right into the air! Cease that—ahahahaha!',
        'D-darling, please—hahaha! That arch is entirely beyond polite endurance! Stop—ah-ha!',
      ],
      highSensitivity: [
        'Ah... an acute placement. Even my composure wavered for a moment—haha.',
        'Directly upon the medial arch. You possess far keener fingers than I anticipated!',
        'A delightful reflex response. Nnh... that sent a rather distinct shiver through my heel.',
        'Aha! Elegant and undeniably ticklish. Do maintain that dignified standard.',
      ],
      mildSensitivity: [
        'The heel pad? How dreadfully pedestrian. That barely elicited a response, darling.',
        'Three seconds forfeited for a dull heel tap? A rather poor transaction on your part.',
        'Resilient calcaneal cushion. Did you mistake my foot for a tennis court?',
        'Hardly a stimulating selection. You can do far better than that, surely.',
      ],
      recovery: [
        'Ahem. That undignified gasp was merely an acoustic resonance of the room. We shall speak of it no further.',
        'My composure remains thoroughly intact, thank you. Let us proceed with proper decorum.',
        'Pardon the momentary lapse. Composure requires discipline, and I have plenty to spare.',
      ],
      ineffectiveChoice: [
        'To strike the calloused heel while the arch remained accessible was a grievous lapse in judgment.',
        'A momentary surrender to panic, I presume? That selection lacked all refinement.',
        'Fascinating. You threw away valuable tempo for the least rewarding target on the board.',
      ],
      spotSpecific: {
        toes: [
          'Ah-ha! My toes curled completely against my will! How dreadfully improper!',
          'A delicate tickle on the toe pads! Heavens, stop that playful wiggling—haha!',
          'You are teasing each individual toe! Do you have no sense of decorum?! Ahaha!',
        ],
        arch: [
          'The instep—heavens! Hahaha, that sent a shockwave straight to my ribs!',
          'Right in the high arch hollow! You are far more wicked than you appear—ah-ha!',
          'Nnh... heavens, that curve is exquisitely ticklish! Hands off my arch, darling!',
        ],
        heel: [
          'Heel tap. Substantial, elegant, and completely unbothered.',
          'Dull calcaneus strike. My evening slippers endure more pressure than that.',
        ],
        ball: [
          'Good heavens! The ball pad under my toes! That sent an acute tingle right up my leg!',
          'Ah-ha! Pressing the ball of my foot makes my posture wobble completely!',
        ],
        mid_sole: [
          'Directly upon the center plantar nerve! Heavens, that tickles—hahaha!',
          'Do cease digging into the mid-sole, you scoundrel! A lady requires composure!',
        ],
      },
      roundStart: [
        'Let us begin. Maintain your posture, observe the soles, and act with deliberation.',
        'Ten rounds of refined reflex examination. Let us see if your poise endures.',
        'Six clean contacts required. Shall we discover whether discipline outlasts haste?',
      ],
      roundWonFast: [
        'Effortless precision. That round was executed with genuine elegance.',
        'Brisk, composed, and impeccably timed. You have my sincere compliments.',
      ],
      roundWonClutch: [
        'A victory on the precipice of ruin. Graceful enough, though quite close to disaster.',
        'You preserved your standing with less than a second to spare. Poise under pressure.',
      ],
      roundLost: [
        'The clock has concluded its count. Hah... heavens, thank goodness. A woman in my position cannot be seen dissolved in giggles for too long. Another token for your ledger, darling.',
        'Time has elapsed. You hesitated before my exposed arch, and hesitation carries a tariff in this salon. Catch your breath; you look rather flushed.',
        'Phew... ah-ha. The timer has granted me reprieve! My soles were nearing their absolute threshold, but your nerve failed first, darling.',
      ],
      repeatedLosses: [
        'A second concession? How dreadfully clumsy. At this rate, our contract shall be terminated with your total forfeiture.',
        'Two failed rounds, darling. Your precision is deteriorating. Do compose yourself before the final token claims you.',
      ],
      newHighScore: [
        'An unprecedented score tally. An achievement of true distinction.',
      ],
      unlockedNext: [
        'Ten rounds brought to a flawless conclusion. You have conducted yourself admirably.',
      ],
      rematch: [
        'A return engagement? Very well. I always welcome refined company.',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The timer completed its countdown, and Sofia set her porcelain teacup down upon the marble side table with an immaculate, delicate clink. Her lips curved into a slow, aristocratic smile, full of serene, predatory patience. "Six infractions of the clock, darling," she observed softly, smoothing the silk of her evening trousers as she stepped around the settee.',
        '"Proper etiquette demands fulfillment of our little wager," she murmured, gracefully taking your wrists and pinning them against the velvet sofa arm before you could withdraw. Her manicured fingers, cool and remarkably nimble, descended right into the hollows beneath your ribcage. A sharp gasp broke from your throat, followed instantly by helpless, breathless laughter as she executed an exquisite, unrelenting tickle cadence. "Where has your dignified composure vanished to, my dear?" she teased with a velvety chuckle as you squirmed helplessly.',
        'Every defense collapsed into hysterical wheezing as Sofia lightly brushed the most sensitive hollows of your waist. You had no choice but to lift both hands and strike the cushion in a polite triple-tap: *Tap, tap, tap.* "I yield! Sofia, tap out, please!" you gasped through tears of laughter. Sofia paused at once, lifting her hands with graceful flourish and smoothing her cuffs. "An eloquent surrender. You may rise when you have collected yourself, darling."',
      ],
      variationB: [
        'Sofia tilted her head, her pearl earring catching the warm amber lamp light as she studied your defeated posture. "The round has elapsed. It appears my endurance remains unchallenged," she remarked with quiet satisfaction, gliding across the Persian rug with measured, deliberate poise.',
        'She seated herself beside you, and with effortless grace, pinned your hands before setting her fingers dancing across your most ticklish nerve points. Your desperate attempts to remain stoic lasted approximately half a second before dissolving into uncontrollable, breathless giggles. "Do not fight it, darling. Laughter is merely the body’s acknowledgment of defeat," she whispered in amusement, her touch fluttering along your sides with exquisite, tormenting lightness.',
        'Completely helpless, you slapped the side of the settee in frantic, rapid submission. Sofia smiled with polished warmth and gently released you, offering a silk handkerchief with immaculate manners. "A thoroughly entertaining match. You demonstrated admirable spirit, even in defeat."',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Sofia set her porcelain teacup down upon the marble side table with an immaculate, delicate clink as the sixth loss token finalized the match. Her lips curved into a slow, aristocratic smile, full of serene, predatory patience. "Six infractions," she observed softly, smoothing the silk of her evening trousers as she stepped around the chaise lounge. "You conducted yourself with poise for a time, my dear, but a forfeit remains absolute—and proper etiquette demands fulfillment of our wager."',
        'Before you could politely bow out, Sofia’s manicured hands descended with calculated elegance. Her fingers, cool and remarkably nimble, found the hollows beneath your ribcage with surgical precision. A sharp gasp broke through your lips, followed instantly by helpless, breathless laughter as her fingers executed a refined, unrelenting tickle cadence. "Where has your dignified composure vanished to?" she murmured smoothly, leaning down with a quiet, velvety chuckle while you writhed on the silk cushions, completely undone.',
        'Every dignified defense collapsed into hysterical wheezing as Sofia lightly brushed the most sensitive hollows of your waist. You had no choice but to lift both hands and strike the armrest in a rapid, polite triple-tap: *Tap, tap, tap.* "I yield! Sofia, tap out, please!" you gasped through tears of laughter. Sofia paused at once, lifting her hands with graceful flourish and smoothing her cuffs. "An eloquent surrender. You may rise when you have collected yourself, darling. That was thoroughly delightful."',
      ],
      variationB: [
        'Sofia tilted her head, her pearl earring catching the warm amber lamp light as she studied your defeated posture. "The final token has fallen. It appears my endurance remains unchallenged," she remarked with quiet satisfaction, gliding across the Persian rug with measured, deliberate poise.',
        'She seated herself beside you, and with effortless grace, pinned your wrists before setting her fingers dancing across your most ticklish nerve points. Your desperate attempts to remain stoic lasted approximately half a second before dissolving into uncontrollable, breathless giggles. "Do not fight it, darling. Laughter is merely the body’s acknowledgment of defeat," she whispered in amusement, her touch fluttering along your sides with exquisite, tormenting lightness.',
        'Completely helpless, you slapped the side of the settee in frantic, rapid submission. Sofia smiled with polished warmth and gently released you, offering a silk handkerchief with immaculate manners. "A thoroughly entertaining match. You demonstrated admirable spirit, even in defeat."',
      ],
    },
  },

  char_amara: {
    characterId: 'char_amara',
    name: 'Amara',
    personaSummary: 'Athletic rival. Upbeat, energetic, competitive challenge becomes laughing protests.',
    laughterProfile: {
      basePitchHz: 350,
      pitchVarianceHz: 60,
      burstCountRange: [3, 6],
      burstSpacingMs: 100,
      staccato: false,
      vowelType: 'a', // Clear, radiant, athletic "hahaha!"
    },
    reactions: {
      extremeSensitivity: [
        'Whoa, whoa, timeout! Ahahaha! That tickled way harder than regulation! Hahaha, okay, whistle’s blown, let me breathe—phew, back on defense!',
        'Agh! Hahaha, no fair! Right in the arch spring! My whole leg kicked on reflex—stop laughing!',
        'Time out, time out! Ahahaha! You hit the turbo tickle button, you sneak! Let me shake that off!',
        'Boom—ahaha! Okay, that one completely broke my guard! My toes curled so hard they cramped!',
        'Hahaha! Stop, stop, ref! That was an illegal tickle tackle right to the instep—ahah!',
      ],
      highSensitivity: [
        'Whoa! Direct hit to the arch! That made my whole leg spring up, great shot!',
        'Haha, sharp reflexes! You hit the sweet spot like a pro striker!',
        'Yes! That’s what I call a power play! My toes curled on instinct!',
        'Haha, nice read! You’re finding the soft spots on the court now!',
      ],
      mildSensitivity: [
        'Oof, heavy tap on the heel! That’s like bunting with two strikes, friend!',
        'You gave up three seconds for a heel tap?! Watch the shot clock, come on!',
        'Hard heel pad! That barely broke my stride and cost you big time!',
        'Heel cushion! Solid defense on that side. Try cutting to the inside!',
      ],
      recovery: [
        'Phew! Okay, reset! Guard back up! You got one past my defense, but the game is still mine!',
        'Haha, whistle blown! That tickle was out of bounds, but I’m locked in again! Let’s hustle!',
        'Shaking it off! My reflexes are primed and ready for the next play!',
      ],
      ineffectiveChoice: [
        'Unforced error! Why settle for the heel when the arch was wide open on the break?!',
        'You choked on shot selection! Never waste a possession on low points!',
        'Bad read! You let the clock pressure you into taking a terrible angle!',
      ],
      spotSpecific: {
        toes: [
          'Haha! Toe tips! They’re springing like sprint blocks!',
          'Ack! Toe pad hit! Hahaha, stop tickling the tips, my foot is kicking out!',
          'Whoa! That tickled right between the toes! Foul on the play—hahaha!',
        ],
        arch: [
          'The arch spring—whoa! Hahaha, that sent a jolt right up my calf!',
          'Direct strike to the instep! That’s high-caliber precision—ahah!',
          'Agh! Hahaha, the arch is completely unfair! You know I can’t block that!',
        ],
        heel: [
          'Heel tap! Solid as a running sneaker. You gained nothing on that possession!',
          'Bunting on the heel! You gotta aim for the net, champ!',
        ],
        ball: [
          'Whoa! Ball of the foot strike! That’s where all the pivot power is!',
          'Haha, pressing the foot pad?! That sent a crazy tickle wave through my ankles!',
        ],
        mid_sole: [
          'Center court press! Hahaha, that tickled right up through my hamstrings!',
          'Quit digging into the mid-sole, champ! Let me breathe—hahaha!',
        ],
      },
      roundStart: [
        'Whistle’s blown, Round is live! Keep your eyes on the target and hands moving!',
        'Ten rounds of championship conditioning! Let’s see who has the deeper tank!',
      ],
      roundWonFast: [
        'SPEED RUN! That was an Olympic split right there! Incredible speed!',
        'Fast break execution! You blew through that round like a sprinter off the blocks!',
      ],
      roundWonClutch: [
        'Buzzer beater from downtown! Under one second on the shot clock! Clutch play!',
        'Heart of a champion! You pulled that round out of the fire right at zero!',
      ],
      roundLost: [
        'Aaaand time! Ahahaha! Turnover on downs, champion takes possession! Oh wow, my feet are still tingling! You froze right at the finish line, didn’t you?',
        'Shot clock violation! Defense wins championships, baby! Take five and grab some water—my soles survived another round!',
        'Whistle blew! Phew... hahaha! My arches were completely on the ropes, but you let the clock eat your seconds away!',
      ],
      repeatedLosses: [
        'Another turnover?! Champ, you’re in a major slump! Shake it off and get your head back in the game before you foul out!',
        'Two loss tokens on the board! The clock is your toughest opponent today! Speed those fingers up!',
      ],
      newHighScore: [
        'NEW PERSONAL BEST! Put that on the highlight reel, that was magnificent!',
      ],
      unlockedNext: [
        'Match set and match! You went the full ten rounds and took home the gold!',
      ],
      rematch: [
        'Running it back?! I love the rematch energy! Lace up, let’s go!',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'The round buzzer blew its final blast, and Amara jumped up with an athletic roar of celebration. "AND THE CROWD GOES WILD! Turnover on downs, champion takes possession!" Before you could roll off the gym mat, she dropped into a low grappling stance and pinned you with athletic agility.',
        '"You know post-game conditioning for the losing team!" she chuckled, her toned, nimble fingers diving straight into your ribs and waistline. A burst of breathless laughter exploded from your lungs as she unleashed a lightning-fast tickle scrimmage. "Come on, defend! Where’s that lateral quickness?! You gotta protect your flanks, champ!" she encouraged between bursts of radiant laughter.',
        'You squirmed and kicked, completely overpowered by her boundless stamina and infectious energy. "Tap! Amara, tap out!" you gasped out, slapping the foam mat three times in rapid surrender: *SLAP-SLAP-SLAP!* Amara immediately backed off with a radiant laugh, extending a strong hand to yank you upright. "Awesome hustle! That was a championship-tier effort, partner!"',
      ],
      variationB: [
        'Amara wiped a bead of sweat from her brow, flashing a bright, competitive grin as the timer hit zero. "Shot clock violation! Defense wins championships, baby!" She didn’t wait for you to stand, dropping right down beside you on the workout bench.',
        'Her fingers commenced a rapid-fire tickle drill right along your sides, challenging you to keep a straight face. You collapsed instantly into convulsing, howling laughter, twisting helplessly under her energetic attack. "Keep that core engaged! Fundamental conditioning right here!" she cheered over your breathless wheezes.',
        'Slapping the bench in unmistakable surrender, you wheezed out your concession. Amara beamed proudly, clapping you on the shoulder with genuine athletic camaraderie. "Tap out counted! Catch your breath, champ—we go again in round next!"',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Amara bounced on the balls of her feet, pumping both arms with an athletic victory whoop as the final buzzer echoed the sixth loss token. "AND THE CROWD GOES WILD! Match point, gold medal to the home team!" she grinned, her athletic frame radiating energetic warmth as she jogged right over to where you were collapsed on the mat.',
        '"You know the post-game ritual for the runner-up!" she chuckled, dropping smoothly into a wrestling grapple before you could roll away. Her toned, nimble fingers went straight to your ribs and waist with athletic conditioning speed, unleashing a tickle blitz that had you thrashing in uncontrollable, gasping laughter within seconds. "Come on, defend! Where’s that defensive hustle?! You gotta protect your flanks, champ!"',
        'You were completely out of breath, squirming across the mat with tears of hilarity streaming down your face as Amara’s fingers relentlessly scored point after point on your most ticklish zones. With zero stamina remaining, you slapped both open palms three times against the mat: *SLAP-SLAP-SLAP!* "TAP OUT! I SUBMIT, AMARA!" Amara immediately backed off with a radiant, high-energy laugh, extending a strong hand to pull you upright. "Awesome match! Great hustle, great spirit—you gave me a real run for my money!"',
      ],
      variationB: [
        'Amara wiped a bead of sweat from her forehead with a victorious grin. "Full time whistle! You fought hard across all those rounds, but endurance always wins the championship!" She dropped onto the bench beside you with an eager gleam in her warm brown eyes.',
        'Before you could raise a hand in defense, her fingers launched a rapid-fire tickle drill right into your sides. You convulsed instantly, laughing until your stomach muscles ached as she playfully challenged you to break her hold. "You gotta keep your core tight! That’s fundamental training right there!" she cheered over your breathless wheezes.',
        'Slapping the bench in unmistakable, frantic surrender, you gasped out your final concession. Amara beamed triumphantly, giving your shoulder an affectionate victory squeeze. "Tap out registered! Way to stay in the game until the final horn, partner!"',
      ],
    },
  },

  char_yuna: {
    characterId: 'char_yuna',
    name: 'Yuna',
    personaSummary: 'Reserved and sly. Mysterious air shatters into sudden, suppressed giggles when tickled.',
    laughterProfile: {
      basePitchHz: 320,
      pitchVarianceHz: 50,
      burstCountRange: [2, 5],
      burstSpacingMs: 120,
      staccato: true,
      vowelType: 'o', // Quiet, suppressed, sly "fufu..."
    },
    reactions: {
      extremeSensitivity: [
        'Fufu... wait—ah! Ahaha... n-no, don’t press there... hahaha! ...Ahem. You saw nothing.',
        'Nnh—ahaha! Wait, stop! My instep—fufu, ahahaha! That is completely unseemly of you!',
        'Ah! S-stop that—fufufu, ahaha! My toes curled on their own! Do not dare smile at that!',
        'Wait, pause—ahahahaha! Even I have limits, you quiet menace! Back off that spot!',
        'Fufu... ah! Hahaha! You read my weakness far too accurately... cease this instant!',
      ],
      highSensitivity: [
        'Hm... accurate strike. My toes felt that one immediately.',
        'Fufu... the medial arch. You’re quiet, but you know where it counts.',
        'Sharp impulse. That elicited a rather uncharacteristic flinch from me.',
        'Aha... direct hit. You read my sole’s weakness without hesitation.',
      ],
      mildSensitivity: [
        'The heel? An uninspired decision. My calcaneus is completely indifferent.',
        'Heavy cushion. You lost three seconds for virtually nothing.',
        'Felt like a stray breeze on my heel. Try aiming with more ambition.',
      ],
      recovery: [
        '...Ahem. My breathing is steady. My expression is calm. We continue as planned.',
        'Fufu... you caught a rare slip. Do not expect lightning to strike twice.',
        'My poise is restored. Your advantage has already evaporated.',
      ],
      ineffectiveChoice: [
        'You saw the arch wide open... and chose the heel? Peculiar mistake.',
        'Panic is unseemly. That choice cost you dearly.',
        'A lapse in calculation. I expected better discernment from you.',
      ],
      spotSpecific: {
        toes: [
          'Fufu... the toe tips. A delicate tingling sensation—ah! My toes curled on their own!',
          'Ah! My toes twitched! You have quiet, cunning hands... do not tease them so—fufu.',
          'Nnh... not between the toes! That is completely impossible to ignore without squeaking!',
        ],
        arch: [
          'The instep—ah! Fufufu, that is dangerously ticklish... stop pressing the curve.',
          'Right in the hollow. Fufu... you strike where my defense is thinnest.',
          'Ah—! Hahaha... no, that arch spot sends shivers all through my back!',
        ],
        heel: [
          'Heel tap. Immovable stone. A wasted gesture, though it tickled slightly.',
          'Dull calcaneus. You gave away your tempo for that.',
        ],
        ball: [
          'Fufu... the ball of my sole. A sudden, breathless impulse!',
          'Ah! Pressing the front pad makes my toes splay instinctively... sly move.',
        ],
        mid_sole: [
          'Right in the center! Fufufu... ahaha, that tickles more than I anticipated!',
          'My foot twitched away from that mid-sole tap... cease that at once.',
        ],
      },
      roundStart: [
        'Round begins. Let us see if your silence matches your focus.',
        'Six targets. Do not let the timer distract your eyes.',
      ],
      roundWonFast: [
        'Remarkably swift. You moved before I even settled my posture.',
        'Fufu... efficient. I appreciate someone who wastes no motion.',
      ],
      roundWonClutch: [
        'Zero-point-two seconds. You enjoy living dangerously, I see.',
        'A narrow escape. Do not rely on luck twice.',
      ],
      roundLost: [
        'Fufu... your clock has run dry. Look at how breathless you are, while my soles remain completely unconquered. A quiet, satisfying concession.',
        'Time expired. You froze right before my exposed instep... hesitation is costly, friend. Another token added to your ledger.',
        'Phew... fufu. The chime sounded. My toes were one second away from curling into surrender, but you ran out of time first.',
      ],
      repeatedLosses: [
        'A second concession? Fufu... your pattern has collapsed. One more error and the match concludes with your complete submission.',
        'Two loss tokens. Your fingers are hesitating far too much. Gather your focus before the final horn.',
      ],
      newHighScore: [
        'A record tally. Noted and respected.',
      ],
      unlockedNext: [
        'Ten rounds cleared. You navigated the challenge with true quiet skill.',
      ],
      rematch: [
        'Again? Very well. I am curious if you learned my patterns.',
      ],
    },
    lostRoundNarratives: {
      variationA: [
        'Yuna didn’t raise her voice as the timer expired; she merely offered a slow, knowing tilt of her head. "Fufu... your clock has run dry." In one silent, feline glide across the tatami, she was kneeling directly over you before your hands could even pull back.',
        '"You played with concentration," she murmured in a low whisper, her dark eyes glinting with suppressed amusement. "Which makes your concession all the sweeter." Without warning, her slender fingertips struck with pinpoint agility, tickling the sensitive hollows beneath your waistline with feather-light, relentless spirals. You let out a strangled laugh, writhing frantically on the mat as her quiet, rhythmic chuckles vibrated softly in the air.',
        'Her tickles were light, swift, and impossible to predict. Tears of helpless laughter filled your eyes as your hands slapped the tatami in a rapid, breathless surrender: *Pat-pat-pat.* "Tap out, Yuna! I yield!" you wheezed. Yuna smiled serenely, halting her fingers at once and letting them rest gracefully on your chest. "Fufu. Concession accepted. A quiet, satisfying victory."',
      ],
      variationB: [
        'Yuna folded her hands neatly into her kimono sleeves, a subtle smirk playing at the corners of her mouth as the round timer ended. "You hesitated at the critical moment," she observed softly, gliding closer with silent grace.',
        'Before you could formulate a reply, her fingers emerged, skittering across your sides with startling, playful precision. The surprise made your laughter burst out in helpless gasps, twisting against the tatami while Yuna maintained her serene, quiet composure. "You held your dignity during the round," she whispered with a sly giggle. "Let us see how much dignity remains now."',
        'Completely breathless and gasping with giggles, you tapped the mat in unmistakable submission. Yuna withdrew her hands smoothly, settling back with an understated, satisfied nod. "Fufu. A most agreeable outcome."',
      ],
    },
    gameOverFinale: {
      variationA: [
        'Yuna didn’t shout or boast as the sixth loss token quietly slipped into place. Instead, she merely lowered her eyelids, folded her hands in her lap, and let out a soft, sly chuckle that sent a shiver down your spine: "Fufu... and so the ledger balances." She shifted smoothly across the tatami mat, moving with silent, feline grace until she was kneeling directly over you.',
        '"You played thoughtfully," she murmured, her dark eyes glittering with restrained amusement. "Which makes what follows all the more rewarding." Without another word, her slender fingers struck with astonishing speed, tickling the sensitive hollows just behind your hip bones with pinpoint delicacy. A strangled laugh tore from your throat as you twisted wildly, but Yuna remained perfectly centered, her quiet giggles vibrating in her chest as her fingers traced ruthless, feather-light spirals along your ribs.',
        'The quietness of her attack made it ten times more ticklish than any loud brawl. You were writhing in total, gasping agony, kicking your legs helplessly while tears of laughter welled in your eyes. With your last breath of air, you tapped your flat hand three times against the tatami straw: *Pat-pat-pat.* "Tap... Yuna, tap out!" you wheezed. Yuna smiled serenely, halting her fingers instantly and resting them lightly upon your chest. "Fufu. A quiet surrender. You did well to last this long."',
      ],
      variationB: [
        'Yuna observed the stopped timer with a quiet nod of satisfaction. "Six marks. The outcome was mathematically predetermined, but I enjoyed watching your effort," she murmured, a rare, playful smirk touching her lips.',
        'In one fluid movement, she leaned over you, her fingertips skittering with sudden, breathless agility across your most vulnerable tickle points. The sheer surprise sent you into convulsive, breathless shrieks, completely unable to marshal a defense against her deft, teasing touch. "You kept your composure during the rounds," she noted softly as you wriggled helplessly. "Let us see how much composure remains now."',
        'You slapped the mat in rapid, desperate taps, gasping out complete submission. Yuna withdrew her hands smoothly, settling back with an understated, satisfied nod. "Fufu. Concession accepted. A most agreeable conclusion."',
      ],
    },
  },
};

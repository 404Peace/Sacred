/* Auto-split from the single-file guide. Safe to edit. */

const HEROES = [
{id:"Obla",name:"Lili Beya",color:"ff00ff",primary:"AGI",str:1,agi:9,int:1,ms:450,hp:500,mana:0,dmg:33,range:280,spells:[
  {slot:1,id:"AEfk",name:"Kiss of Death",key:"Q",lvl:2,tip:"- Cleaves out a death storm to harvest the lives of nearby enemies -|n |cffcc99ff*|r|cff80ff00Attack Power X 60% + Agility X 5 Fire Attack Damage|r|n |cffcc99ff*|r|cffff00ffResets your next attack|r|n [|cff99ccffCharm Enhancement: damage increased to Attack Power X 80% + Agility X 8|r]"},
  {slot:2,id:"A00H",name:"Death Sweetheart",key:"W",lvl:6,tip:"- The Executioner spins a giant rapier to cut down nearby enemies -|n |cffcc99ff*|r|cff80ff00Deals Attack Power X 100% + Agility X 8.5 Fire Attack Damage in a ring area|n   The inner ring takes 50% damage|r|n [|cff99ccffCharm Enhancement: your next attack within 3s deals Agility X 8 Fire Attack Damage|r]"},
  {slot:3,id:"A00I",name:"Bloodthirsty Hand",key:"E",lvl:12,tip:"- The Executioner's bloody duty leaves her emotionless -|n |cffcc99ff*|r|cff80ff00Passive: each attack grants 1 Execution stack, up to 10 stacks, each lasting 10s|r|n |cffcc99ff*|r|cffff0000Passive: attacks deal extra Agility X stacks X 0.20 Fire Attack Damage|r|n |cffcc99ff*|r|cffff0000Active: teleport to the target, suppress it for 1.5s and deal (Agility X 3 + Attack Power X 50%) X your Execution stacks Fire Damage|r"},
  {slot:4,id:"A00J",name:"Harvest Prey",key:"R",lvl:20,tip:"- The Executioner is nimble and can dash across the battlefield -|n |cffcc99ff*|r|cff80ff00Dash deals Attack Power X 100% + Agility X 4 Fire Damage|r"},
  {slot:5,id:"A00K",name:"Stage of Execution",key:"T",lvl:35,tip:"- In this dark night, no one can escape! -|n |cffcc99ff*|r|cff80ff00Creates a domain lasting 8s that deals Agility X 4 Fire Damage every second|r"}
]},
{id:"Hpal",name:"Livinia",color:"ff4499",primary:"AGI",str:3,agi:8,int:1,ms:400,hp:525,mana:100,dmg:40,range:350,spells:[
  {slot:1,id:"A0CN",name:"Demon God Flash",key:"Q",lvl:2,tip:"- The swift demon sword wipes out enemies in an instant|n |cffcc99ff*|r|cff80ff00Dash in and deal Attack Power X 250% attack damage, usable up to two times|r"},
  {slot:2,id:"A0CO",name:"Demon Sword Invasion",key:"W",lvl:6,tip:"- A storm no enemy can withstand|n |cffcc99ff*|r|cff80ff00Each slash deals Agility X 2.5 + Attack Power X 15% damage in the facing direction|r"},
  {slot:3,id:"A0CQ",name:"Cursed Heart",key:"E",lvl:12,tip:"- The cursed Darkblood is undying -|n |cffcc99ff*|r|cff80ff00Suspend yourself for 5s and restore 20% Maximum Health every 1s|r"},
  {slot:4,id:"A0CR",name:"Shadow Sword Dance",key:"R",lvl:20,tip:"- Your future will be shattered|n |cffcc99ff*|r|cff80ff00Each sword shadow deals Agility X 12 + Attack Power X 150% damage, up to 2|r"},
  {slot:5,id:"A0CS",name:"Annihilation",key:"T",lvl:35,tip:"- Kill! Destroy everything! The end is coming!|n |cffcc99ff*|r|cff80ff00Deal Agility X 4 attack damage around you every second|r"}
]},
{id:"O01E",name:"Elestereya",color:"ccffcc",primary:"AGI",str:1,agi:9,int:1,ms:400,hp:500,mana:0,dmg:33,range:1000,spells:[
  {slot:1,id:"A036",name:"Storm Shot",key:"Q",lvl:2,tip:"- The Wind Ranger's mighty shot, no one can defend against it -|n |cffcc99ff*|r|cff80ff00Passive: every 5 attacks deal Attack Power X 80% + Agility X 1 extra Wind attack damage|r|n |cffcc99ff*|r|cff80ff00Active: deal Attack Power X 300% + Agility X 4 Wind attack damage to the target|r"},
  {slot:2,id:"A038",name:"Scatterburst Arrows",key:"W",lvl:6,tip:"- Beyond wind power the Ranger wields the mystic arrows of the Manyue Clan -|n |cffcc99ff*|r|cff80ff00Every ten attacks, the next attack deals Attack Power X 250% extra normal attack true damage|r"},
  {slot:3,id:"A037",name:"Breeze Step",key:"E",lvl:12,tip:"- The Wind Ranger channels wind into her feet for Movement Speed -|n |cffcc99ff*|r|cff80ff00Attacks on marked targets deal Attack Power X 15% + Agility X 0.15 Wind Damage|r"},
  {slot:4,id:"A039",name:"Ruinous Arrow Rain",key:"R",lvl:20,tip:"- The Wind Ranger calls the power of the sky to create a ruinous storm -|n |cffcc99ff*|r|cff80ff00After a delay, deal Agility X 15 Wind Damage|r"},
  {slot:5,id:"A03A",name:"Storm Power",key:"T",lvl:35,tip:"- Be destroyed within the storm! This is the full divine power of the Wind Descendant! -|n |cffcc99ff*|r|cff80ff00For 12s, restore 5% Maximum Health every 1s and gain 80% Attack Speed|r"}
]},
{id:"O01D",name:"Kisaragi Tose",color:"00ccff",primary:"AGI",str:1,agi:9,int:1,ms:400,hp:600,mana:0,dmg:33,range:220,spells:[
  {slot:1,id:"A016",name:"Water Slash",key:"Q",lvl:2,tip:"- Performs a circular cutting attack -|n|cffcc99ff*|r|cff80ff00Agility X 6.5 Water Damage|r"},
  {slot:2,id:"A01O",name:"Dragon Spring Flash",key:"W",lvl:6,tip:"- Dashes to the target area and delivers a lethal strike to enemies in range -|n|cffcc99ff*|r|cff80ff00Agility X 10 + Attack Power X 150% Water Damage|r"},
  {slot:3,id:"A018",name:"Raging Waves",key:"E",lvl:12,tip:"- The samurai unleashes the power of his twin blades and becomes water to assault enemies -|n|cffcc99ff*|r|cff80ff00Gain 20 Movement Speed every 0.5s for 6s, up to 240|r"},
  {slot:4,id:"A019",name:"Azure Scales",key:"R",lvl:20,tip:"- Living water becomes a torrent and annihilates enemies -|n|cffcc99ff*|r|cff80ff00Deals Agility X 5 Water Damage per second for 4s|r"},
  {slot:5,id:"A01A",name:"Dance of the Sea Moon",key:"T",lvl:35,tip:"- Spins water currents with an aura to cut enemies for massive damage -|n|cffcc99ff*|r|cff80ff00Deals Agility X 4 Water Damage per second for 10s|r"}
]},
{id:"O01C",name:"Fulan Xiaolu",color:"ccffff",primary:"AGI",str:1,agi:9,int:1,ms:400,hp:600,mana:0,dmg:40,range:850,spells:[
  {slot:1,id:"A05G",name:"Shadow Step",key:"Q",lvl:2,tip:"- Load up and roll forward at once -|n |cffcc99ff*|r|cff80ff00The next attack deals Attack Power X 200% + Agility X 3.5 Fire attack area damage|r"},
  {slot:2,id:"A05H",name:"Killer's Bullet",key:"W",lvl:6,tip:"- You are already dead -|n |cffcc99ff*|r|cff80ff00Deal area Agility X 10 Fire Damage|r"},
  {slot:3,id:"A05I",name:"Doomsday Descent",key:"E",lvl:12,tip:"- Fire a powerful dark missile that deals massive damage to enemies it hits -|n |cffcc99ff*|r|cff80ff00Deal Attack Power X 250% + Agility X 17.5 Fire Damage|r"},
  {slot:4,id:"A05K",name:"Enhanced Reload",key:"R",lvl:20,tip:"- Crush the enemy with everything you have! -|n |cffcc99ff*|r|cff80ff00The next attack triggers five hits of Attack Power X 100% Fire Damage within 1s|r"},
  {slot:5,id:"A05J",name:"Hellstorm",key:"T",lvl:35,tip:"- Swiftly fire once at the enemies around you -|n |cffcc99ff*|r|cff80ff00Attack Power X 200% + Agility X 10 normal attack damage|r"}
]},
{id:"O016",name:"Jing Ke",color:"80ff80",primary:"AGI",str:1,agi:9,int:1,ms:450,hp:500,mana:0,dmg:33,range:250,spells:[
  {slot:1,id:"A078",name:"Assassinate",key:"Q",lvl:2,tip:"- The Assassin excels at slaying foes with deadly poison -|n |cffcc99ff*|r|cff80ff00Attack Power X 200% Wind single-target & 100% area independent damage|r"},
  {slot:2,id:"A079",name:"Swallow Return",key:"W",lvl:6,tip:"- True Assassins walk in darkness unseen -|n |cffcc99ff*|r|cff80ff00Deal Attack Power X 125% + Agility X 9 Wind Damage in a line|r"},
  {slot:3,id:"A07A",name:"Dagger Revealed",key:"E",lvl:12,tip:"- To reach her goal she pays any price; assassination is her only fate -|n |cffcc99ff*|r|cff80ff00For the next 15s, raise Spell Damage by [5 + (Agility/200)]% and reduce Maximum Health by 20%|r"},
  {slot:4,id:"A07B",name:"Secret Art: Swallow Dance",key:"R",lvl:20,tip:"- The Assassin is so agile she can strike an enemy three times in an instant -|n |cffcc99ff*|r|cff80ff00Attack Power X 130% + Agility X 18 Wind Damage|r"},
  {slot:5,id:"A07C",name:"Ultimate Backstab",key:"T",lvl:35,tip:"- The show ends here; next comes the final curtain -|n |cffcc99ff*|r|cff80ff00Attack Power X 300% + Agility X 45 Wind Damage|r"}
]},
{id:"O01I",name:"Dili",color:"ffffff",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:10,dmg:33,range:550,spells:[
  {slot:1,id:"A01Z",name:"White Lightning Blade",key:"Q",lvl:2,tip:"- The witch strikes enemies with a blade formed from electric arcs -|n |cffcc99ff*|r|cff80ff00Intelligence X 5 Lightning Damage|r"},
  {slot:2,id:"A020",name:"White Lightning Orb",key:"W",lvl:6,tip:"- The shrine maiden creates a lightning orb to strike enemies in an area -|n |cffcc99ff*|r|cff80ff00Intelligence X 7.5 Lightning Damage|r"},
  {slot:3,id:"A021",name:"White Lightning Realm",key:"E",lvl:12,tip:"- The witch enchants herself with lightning and purifies allies -|n |cffcc99ff*|r|cff80ff00Deals Intelligence X 4 Lightning Damage to nearby enemies every second for 5s|r"},
  {slot:4,id:"A022",name:"Black Lightning Heartrender",key:"R",lvl:20,tip:"- The witch gathers lightning in her hand for a lethal strike -|n |cffcc99ff*|r|cff80ff00Intelligence X 17.5 Lightning Damage|r"},
  {slot:5,id:"A023",name:"Black Lightning Sky Breaker",key:"T",lvl:35,tip:"- The witch focuses all her electricity to finish off her enemies -|n |cffcc99ff*|r|cff80ff00Deals Intelligence X 25 Lightning Damage|r"}
]},
{id:"O01J",name:"Lianhua",color:"ccffff",primary:"INT",str:1,agi:1,int:9,ms:400,hp:600,mana:100,dmg:40,range:350,spells:[
  {slot:1,id:"A02K",name:"Six Senses Purified Slash",key:"Q",lvl:2,tip:"- Uses a condensed moon blade to cut enemies -|n |cffcc99ff*|r|cff80ff00Intelligence X 6 Wind Damage|r"},
  {slot:2,id:"A0BV",name:"Cycle Flowing Slash",key:"W",lvl:6,tip:"- Swing the moon blade to cut surrounding enemies -|n |cffcc99ff*|r|cff80ff00Intelligence X 7.5 Wind area damage|r"},
  {slot:3,id:"A0BX",name:"Karma Wind Flash Array",key:"E",lvl:12,tip:"- Protect yourself with the power of moonlight -|n |cffcc99ff*|r|cff80ff00Passive: attacks have a 15% chance to grant a 5s Moonlight Mark|r"},
  {slot:4,id:"A0BY",name:"Underworld Light Flash",key:"R",lvl:20,tip:"- Cut through enemies in a line with phantom force for massive damage -|n |cffcc99ff*|r|cff80ff00Intelligence X 12.5 Wind Damage|r"},
  {slot:5,id:"A0BZ",name:"Seven Soul Taboo",key:"T",lvl:35,tip:"- Release the evil power sealed on the dark side of the moon -|n |cffcc99ff*|r|cff80ff00Enter Shadow Mode, gaining 5% Spell Damage per second|r"}
]},
{id:"O01G",name:"Roluli",color:"ffd966",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:1000,dmg:33,range:900,spells:[
  {slot:1,id:"A04J",name:"Holy Baptism",key:"Q",lvl:2,tip:"- The Nun prays to the Holy Light to bless allies -|n |cffcc99ff*|r|cff80ff00Restore Intelligence X 2.5 Health|r|n |cffcc99ff*|r|cff80ff00Deal Intelligence X 9 Normal Damage|r"},
  {slot:2,id:"A04K",name:"Angel Descent",key:"W",lvl:6,tip:"- The Nun prays for the Light God's protection, summoning a trainee angel to aid the worthy -|n |cffcc99ff*|r|cff80ff00Summons Angel Amy|r"},
  {slot:3,id:"A04N",name:"Hymn",key:"E",lvl:12,tip:"- Bless everyone with holy light from the heavens -|n |cffcc99ff*|r|cff80ff00Raise the target's and your own All Attributes by Intelligence X 15% for 60s|r"},
  {slot:4,id:"A04P",name:"Divine Decree",key:"R",lvl:20,tip:"- The Nun borrows an archangel's power to punish enemies and buff allies -|n |cffcc99ff*|r|cff80ff00Deal Intelligence X 22.5 Normal Damage|r"},
  {slot:5,id:"A04Q",name:"Divine Realm Descent",key:"T",lvl:35,tip:"- Summons a projection of the heavens -|n |cffcc99ff*|r|cff80ff00Create a divine domain for 12s that deals Intelligence X 4 Normal Damage every 2 seconds|r"}
]},
{id:"O018",name:"Roluli (Legendary)",color:"ffd966",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:1000,dmg:33,range:900,spells:[
  {slot:1,id:"A04J",name:"Holy Baptism",key:"Q",lvl:2,tip:"- The Nun prays to the Holy Light to bless allies -|n |cffcc99ff*|r|cff80ff00Restore Intelligence X 2.5 Health|r"},
  {slot:2,id:"A04K",name:"Angel Descent",key:"W",lvl:6,tip:"- Summons Angel Amy to protect the worthy|r"},
  {slot:3,id:"A04N",name:"Hymn",key:"E",lvl:12,tip:"- Bless everyone with holy light -|n |cffcc99ff*|r|cff80ff00Raise All Attributes by Intelligence X 15% for 60s|r"},
  {slot:4,id:"A04P",name:"Divine Decree",key:"R",lvl:20,tip:"- Punish enemies and buff allies -|n |cffcc99ff*|r|cff80ff00Deal Intelligence X 22.5 Normal Damage|r"},
  {slot:5,id:"A04Q",name:"Divine Realm Descent",key:"T",lvl:35,tip:"- Summon a divine domain|r"}
]},
{id:"O017",name:"Roluli (Epic)",color:"ffd966",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:1000,dmg:33,range:900,spells:[
  {slot:1,id:"A04J",name:"Holy Baptism",key:"Q",lvl:2,tip:"- Restore Intelligence X 2.5 Health, deal Intelligence X 9 Normal Damage|r"},
  {slot:2,id:"A04K",name:"Angel Descent",key:"W",lvl:6,tip:"- Summon Angel Amy|r"},
  {slot:3,id:"A04N",name:"Hymn",key:"E",lvl:12,tip:"- Raise All Attributes by Intelligence X 15% for 60s|r"},
  {slot:4,id:"A04P",name:"Divine Decree",key:"R",lvl:20,tip:"- Deal Intelligence X 22.5 Normal Damage, Stun 1s|r"},
  {slot:5,id:"A04Q",name:"Divine Realm Descent",key:"T",lvl:35,tip:"- Create a divine domain for 12s|r"}
]},
{id:"O015",name:"Sylvia Ria",color:"cc99ff",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:1000,dmg:23,range:650,spells:[
  {slot:1,id:"A00U",name:"Shadow Blade",key:"Q",lvl:2,tip:"- The Spirit Caller summons shadow blades to cut enemies -|n |cffcc99ff*|r|cff80ff00Intelligence X 2 Wind Damage|r"},
  {slot:2,id:"A00V",name:"Spirit Shift",key:"W",lvl:6,tip:"- Swap positions with a Four Shadow|r"},
  {slot:3,id:"A00W",name:"Soul-Devouring Pact",key:"E",lvl:12,tip:"- Deals Intelligence X 6 Wind Damage to enemies between you and the Four Shadows every 1s|r"},
  {slot:4,id:"A00Y",name:"Death Domain",key:"R",lvl:20,tip:"- Intelligence X 3.5 Wind Damage, once every 0.5s for 3s|r"},
  {slot:5,id:"A00X",name:"Ring of Desecration",key:"T",lvl:35,tip:"- Each wave deals Intelligence X 10 Wind Elemental Damage|r"}
]},
{id:"O00Y",name:"Huihui",color:"ffd966",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:6,dmg:33,range:750,spells:[
  {slot:1,id:"A004",name:"Blaze Talisman - Summer Spark",key:"Q",lvl:2,tip:"- Intelligence X 7 Fire Damage|r"},
  {slot:2,id:"A005",name:"Ghost Talisman - Fire of Gods and Demons",key:"W",lvl:6,tip:"- Intelligence X 10 Fire Damage, Stuns enemies for 1s|r"},
  {slot:3,id:"A008",name:"Divine Talisman - Dream of the Flame Roar",key:"E",lvl:12,tip:"- Intelligence X 8 Fire Damage, once every 0.5s for 2s|r"},
  {slot:4,id:"A007",name:"Fire Talisman - Mirror of the Sun",key:"R",lvl:20,tip:"- Gain 12% Fire Damage for 8s|r"},
  {slot:5,id:"A006",name:"Deity - True Flame Purgatory",key:"T",lvl:35,tip:"- Intelligence X 7 Fire Damage, once every 1s for 6 hits|r"}
]},
{id:"O00Z",name:"Yuan",color:"ff0080",primary:"INT",str:1,agi:5,int:5,ms:400,hp:500,mana:30,dmg:40,range:1000,spells:[
  {slot:1,id:"A07I",name:"Redeeming Arrow",key:"Q",lvl:2,tip:"- Purify Form: Agility X 4.5 Lightning Damage|r"},
  {slot:2,id:"A07J",name:"Savior",key:"W",lvl:6,tip:"- Active: switch the form of Magic Arrow|r"},
  {slot:3,id:"A07K",name:"Magic Arrow: Miracle Manifest",key:"E",lvl:12,tip:"- Deals different elemental damage depending on the form|r"},
  {slot:4,id:"A07L",name:"Magic Arrow: Causality Accumulation",key:"R",lvl:20,tip:"- Healing Form: Intelligence X 20 Lightning Damage, Stun 1s|r"},
  {slot:5,id:"A07M",name:"Magic Arrow: Divine Light Rain",key:"T",lvl:35,tip:"- Healing Form: Intelligence X 22.5 / Purify Form: Attack Power X 300% + Agility X 17.5 Lightning Damage|r"}
]},
{id:"O00R",name:"Remi",color:"99ccff",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:3,dmg:23,range:750,spells:[
  {slot:1,id:"A03I",name:"Divine Water Flask",key:"Q",lvl:2,tip:"- Intelligence X 10 Water Elemental Damage|r"},
  {slot:2,id:"A03J",name:"Water Shield",key:"W",lvl:6,tip:"- Intelligence X 5.3 base shield Health, lasting 5s|r"},
  {slot:3,id:"A03K",name:"Torrent Field",key:"E",lvl:12,tip:"- Intelligence X 30 Water Elemental Damage|r"},
  {slot:4,id:"A03L",name:"Arcane Water Pump",key:"R",lvl:20,tip:"- Intelligence X 30 Water Elemental Damage|r"},
  {slot:5,id:"A03M",name:"Fakis' Magic Mirror",key:"T",lvl:35,tip:"- Each shot deals Intelligence X 26 Water Elemental Damage|r"}
]},
{id:"O01A",name:"Aki",color:"cc99ff",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:8,dmg:35,range:750,spells:[
  {slot:1,id:"A014",name:"Flying Dagger Performance",key:"Q",lvl:2,tip:"- Each dagger deals Intelligence X 3 Normal Damage|r"},
  {slot:2,id:"A01J",name:"Warped Space",key:"W",lvl:6,tip:"- Units in the area are paused for 2s and take 10% more Spell Damage from you|r"},
  {slot:3,id:"A01K",name:"Deadly Blade",key:"E",lvl:12,tip:"- Deals Intelligence X 20 Normal Damage and stuns the target for 1s|r"},
  {slot:4,id:"A01L",name:"Dashing Top Student",key:"R",lvl:20,tip:"- Enter Blade Power enhancement for 10s|r"},
  {slot:5,id:"A01M",name:"Gorgeous Curtain Call Gift",key:"T",lvl:35,tip:"- Each Miracle Dagger deals Intelligence X 3 Normal Damage|r"}
]},
{id:"O00V",name:"Black Medea",color:"a8ffb0",primary:"STR",str:9,agi:1,int:1,ms:400,hp:700,mana:0,dmg:35,range:250,spells:[
  {slot:1,id:"A06G",name:"Soul Harvest",key:"Q",lvl:2,tip:"- Attack Power X 120% + Strength X 5 Wind Damage|r"},
  {slot:2,id:"A06H",name:"Soul Blessing",key:"W",lvl:6,tip:"- For 20 seconds, raise your and nearby allies' Spell Damage by 4 + Strength/400 %|r"},
  {slot:3,id:"Aspb",name:"Annihilation Three-Stage",key:"E",lvl:12,tip:"- Choose a judgment form and unleash it|r"},
  {slot:4,id:"A06M",name:"Ethereal Ruin Slash",key:"R",lvl:20,tip:"- Attack Power X 275% + Strength X 20 Wind Damage|r"},
  {slot:5,id:"A06N",name:"Death Sentence",key:"T",lvl:35,tip:"- Attack Power X 220% + Strength X 45.5 Wind Damage|r"}
]},
{id:"O00Q",name:"Karensius",color:"cc99ff",primary:"STR",str:9,agi:1,int:1,ms:400,hp:700,mana:0,dmg:30,range:200,spells:[
  {slot:1,id:"A04B",name:"Earthrend Slash",key:"Q",lvl:2,tip:"- Attack Power X 60% + Strength X 3 + Maximum Health X 25% Fire Damage|r"},
  {slot:2,id:"A04C",name:"Whirlwind Slash",key:"W",lvl:6,tip:"- Attack Power X 100% + Strength X 10 + Maximum Health X 50% Fire Damage|r"},
  {slot:3,id:"A04D",name:"Arcane Charge",key:"E",lvl:12,tip:"- Deal Attack Power X 130% + Strength X 15 + Maximum Health X 50% Fire Damage|r"},
  {slot:4,id:"A04E",name:"Heroic Strike",key:"R",lvl:20,tip:"- Attack Power X 150% + Strength X 22 + Maximum Health X 125% Fire Damage|r"},
  {slot:5,id:"A04F",name:"Odesheim Arcane Heavy Armor",key:"T",lvl:35,tip:"- Enter Armed Mode, gaining 12% Spell Damage at the cost of 6% Maximum Health per second|r"}
]},
{id:"O01H",name:"Alice",color:"ff9bff",primary:"STR",str:9,agi:1,int:1,ms:400,hp:730,mana:100,dmg:35,range:200,spells:[
  {slot:1,id:"A081",name:"Blood Blade",key:"Q",lvl:2,tip:"- Attack Power X 80% Fire attack damage|r"},
  {slot:2,id:"A082",name:"Blood Curse Burst",key:"W",lvl:6,tip:"- Attack Power X 140% + Strength X 3.5 Fire attack damage|r"},
  {slot:3,id:"A083",name:"Demon's Roar",key:"E",lvl:12,tip:"- Passive: gain 15% Elemental Resistance and 1.5% attack damage per 5% Health lost|r"},
  {slot:4,id:"A084",name:"Demon Lady's Descent",key:"R",lvl:20,tip:"- Attack Power X 300% + Strength X 10 Fire attack damage|r"},
  {slot:5,id:"A086",name:"Demon King's Pact",key:"T",lvl:35,tip:"- Passive: each attack grants 4% Attack Power, stacking up to 7 times|r"}
]},
{id:"O013",name:"Alice (Epic)",color:"ff9bff",primary:"STR",str:9,agi:1,int:1,ms:400,hp:730,mana:100,dmg:35,range:200,spells:[
  {slot:1,id:"A081",name:"Blood Blade",key:"Q",lvl:2,tip:"- Attack Power X 80% Fire attack damage|r"},
  {slot:2,id:"A082",name:"Blood Curse Burst",key:"W",lvl:6,tip:"- Fire attack damage|r"},
  {slot:3,id:"A083",name:"Demon's Roar",key:"E",lvl:12,tip:"- Gain 15% Elemental Resistance|r"},
  {slot:4,id:"A084",name:"Demon Lady's Descent",key:"R",lvl:20,tip:"- Fire attack damage|r"},
  {slot:5,id:"A086",name:"Demon King's Pact",key:"T",lvl:35,tip:"- Passive buff|r"}
]},
{id:"O00T",name:"Icarus",color:"f5e58a",primary:"STR",str:9,agi:1,int:1,ms:400,hp:700,mana:0,dmg:23,range:160,spells:[
  {slot:1,id:"A00N",name:"Radiance",key:"Q",lvl:2,tip:"- Strength X 4 + Attack Power X 60% Lightning Damage|r"},
  {slot:2,id:"A00O",name:"Declaration of Guilt",key:"W",lvl:6,tip:"- Attack Power X 350% + Strength X 4 Lightning Damage|r"},
  {slot:3,id:"A00P",name:"Aegis of Light",key:"E",lvl:12,tip:"- For 10s you and nearby allies gain a shield|r"},
  {slot:4,id:"A00Q",name:"Power of the Holy Cross",key:"R",lvl:20,tip:"- Deals Strength X 3 + Attack Power X 30% Lightning Damage to nearby enemies every 1s|r"},
  {slot:5,id:"A00R",name:"Holy Light Chain",key:"T",lvl:35,tip:"- Links you and the target for 15s|r"}
]},
{id:"O00X",name:"Icarus (Epic)",color:"f5e58a",primary:"STR",str:9,agi:1,int:1,ms:400,hp:700,mana:0,dmg:23,range:160,spells:[
  {slot:1,id:"A00N",name:"Radiance",key:"Q",lvl:2,tip:"- Lightning Damage|r"},
  {slot:2,id:"A00O",name:"Declaration of Guilt",key:"W",lvl:6,tip:"- Lightning Damage|r"},
  {slot:3,id:"A00P",name:"Aegis of Light",key:"E",lvl:12,tip:"- Shield allies|r"},
  {slot:4,id:"A00Q",name:"Power of the Holy Cross",key:"R",lvl:20,tip:"- Lightning Damage|r"},
  {slot:5,id:"A00R",name:"Holy Light Chain",key:"T",lvl:35,tip:"- Link and bless|r"}
]},
{id:"O014",name:"Yake",color:"ccffff",primary:"STR/AGI",str:5,agi:5,int:1,ms:400,hp:600,mana:5,dmg:35,range:250,spells:[
  {slot:1,id:"A01G",name:"Sigil of Ruin",key:"Q",lvl:2,tip:"- All Attributes X 2.5 Water Damage|r"},
  {slot:2,id:"A02O",name:"Demon-Repelling Sword",key:"W",lvl:6,tip:"- Attack Power X 100% + All Attributes X 1 Water Attack Damage|r"},
  {slot:3,id:"A02Q",name:"Trickster's Sash",key:"E",lvl:12,tip:"- Passive: Attacks have a 20% chance to deal area Water Damage|r"},
  {slot:4,id:"A02R",name:"Wheel of the Claw King",key:"R",lvl:20,tip:"- Deals Water Damage continuously for 10s|r"},
  {slot:5,id:"A0CM",name:"God's Right Arm",key:"T",lvl:35,tip:"- Dash to the target point and deal Attack Power X 135% + All Attributes X 6 Water Damage|r"}
]},
{id:"O00W",name:"Chunshui Yue",color:"80ff80",primary:"STR/AGI",str:5,agi:5,int:1,ms:400,hp:700,mana:5,dmg:33,range:150,spells:[
  {slot:1,id:"A033",name:"Azure Dragon Fist",key:"Q",lvl:2,tip:"- Attack Power X 100% + Strength X 7 Water Damage|r"},
  {slot:2,id:"A03F",name:"Azure Dragon Break",key:"W",lvl:6,tip:"- Strength X 9.5 Water Damage|r"},
  {slot:3,id:"A05M",name:"Azure Counter",key:"E",lvl:12,tip:"- Passive: gain 35% Evasion|r"},
  {slot:4,id:"A05O",name:"Hidden Dragon Rises",key:"R",lvl:20,tip:"- Strength X 30 Water Damage|r"},
  {slot:5,id:"A05N",name:"Dragon Descends",key:"T",lvl:35,tip:"- Strength X (12 + Combo Points X 4.5) Water Damage|r"}
]},
{id:"O00U",name:"Alison Lune",color:"a8ffb0",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:5,dmg:33,range:900,spells:[
  {slot:1,id:"A027",name:"Nature's Energy",key:"Q",lvl:2,tip:"- Restores Intelligence X 1 Health or deals Intelligence X 5.5 Wind Damage per second|r"},
  {slot:2,id:"A028",name:"Gentle Breeze",key:"W",lvl:6,tip:"- Intelligence X 2.5 Wind Damage in range|r"},
  {slot:3,id:"A029",name:"Blessing of the Spirit",key:"E",lvl:12,tip:"- Restores Intelligence X 0.7 Health per second for 15s|r"},
  {slot:4,id:"A02A",name:"Wind Barrier",key:"R",lvl:20,tip:"- Intelligence X 3 Wind Damage in the area|r"},
  {slot:5,id:"A02B",name:"Gift of the World Tree",key:"T",lvl:35,tip:"- Empowers one of your basic skills|r"}
]},
{id:"O01P",name:"Alison Lune (Legendary)",color:"a8ffb0",primary:"INT",str:1,agi:1,int:9,ms:400,hp:500,mana:5,dmg:33,range:900,spells:[
  {slot:1,id:"A027",name:"Nature's Energy",key:"Q",lvl:2,tip:"- Restore Health or deal Wind Damage|r"},
  {slot:2,id:"A028",name:"Gentle Breeze",key:"W",lvl:6,tip:"- Wind Damage in range|r"},
  {slot:3,id:"A029",name:"Blessing of the Spirit",key:"E",lvl:12,tip:"- Restore Health per second|r"},
  {slot:4,id:"A02A",name:"Wind Barrier",key:"R",lvl:20,tip:"- Wind Damage in the area|r"},
  {slot:5,id:"A02B",name:"Gift of the World Tree",key:"T",lvl:35,tip:"- Empower next skill|r"}
]},
{id:"O01Q",name:"Elestereya (Legendary)",color:"ccffcc",primary:"AGI",str:1,agi:9,int:1,ms:400,hp:500,mana:0,dmg:33,range:1000,spells:[
  {slot:1,id:"A036",name:"Storm Shot",key:"Q",lvl:2,tip:"- Wind attack damage|r"},
  {slot:2,id:"A038",name:"Scatterburst Arrows",key:"W",lvl:6,tip:"- Area Wind Damage|r"},
  {slot:3,id:"A037",name:"Breeze Step",key:"E",lvl:12,tip:"- Movement Speed|r"},
  {slot:4,id:"A039",name:"Ruinous Arrow Rain",key:"R",lvl:20,tip:"- Agility X 15 Wind Damage|r"},
  {slot:5,id:"A03A",name:"Storm Power",key:"T",lvl:35,tip:"- Attack Speed and Attack Power|r"}
]},
{id:"O01O",name:"Fenrir (Legendary)",color:"a8ffb0",primary:"AGI",str:1,agi:9,int:1,ms:350,hp:600,mana:0,dmg:51,range:200,spells:[
  {slot:1,id:"A00B",name:"Spring Leaf Fist",key:"-",lvl:2,tip:"- Passive attack damage|r"},
  {slot:2,id:"A00C",name:"Thunder Rush Fist",key:"W",lvl:6,tip:"- Critical chance buff|r"},
  {slot:3,id:"A00D",name:"Water Wave Fist",key:"-",lvl:12,tip:"- Passive damage and self-heal|r"},
  {slot:4,id:"A00E",name:"Flame Extinction Fist",key:"-",lvl:20,tip:"- Armor reduction on attack|r"},
  {slot:5,id:"A00F",name:"Royal Top-Secret Martial Arts Ultimate",key:"T",lvl:35,tip:"- Attack damage aura|r"}
]},
{id:"O00L",name:"Fenrir (Epic)",color:"a8ffb0",primary:"AGI",str:1,agi:9,int:1,ms:350,hp:600,mana:0,dmg:51,range:200,spells:[
  {slot:1,id:"A00B",name:"Spring Leaf Fist",key:"-",lvl:2,tip:"- Passive attack damage|r"},
  {slot:2,id:"A00C",name:"Thunder Rush Fist",key:"W",lvl:6,tip:"- Critical chance buff|r"},
  {slot:3,id:"A00D",name:"Water Wave Fist",key:"-",lvl:12,tip:"- Passive damage and self-heal|r"},
  {slot:4,id:"A00E",name:"Flame Extinction Fist",key:"-",lvl:20,tip:"- Armor reduction on attack|r"},
  {slot:5,id:"A00F",name:"Royal Top-Secret Martial Arts Ultimate",key:"T",lvl:35,tip:"- Attack damage aura|r"}
]},
{id:"O00F",name:"Black Medea (Epic)",color:"a8ffb0",primary:"STR",str:9,agi:1,int:1,ms:400,hp:700,mana:0,dmg:35,range:250,spells:[
  {slot:1,id:"A06G",name:"Soul Harvest",key:"Q",lvl:2,tip:"- Attack Power X 120% + Strength X 5 Wind Damage|r"},
  {slot:2,id:"A06H",name:"Soul Blessing",key:"W",lvl:6,tip:"- Spell Damage buff for allies|r"},
  {slot:3,id:"Aspb",name:"Annihilation Three-Stage",key:"E",lvl:12,tip:"- Judgment form|r"},
  {slot:4,id:"A06M",name:"Ethereal Ruin Slash",key:"R",lvl:20,tip:"- Wind Damage|r"},
  {slot:5,id:"A06N",name:"Death Sentence",key:"T",lvl:35,tip:"- Massive Wind Damage|r"}
]},
{id:"O00E",name:"Chunshui Yue (Epic)",color:"80ff80",primary:"STR/AGI",str:5,agi:5,int:1,ms:400,hp:700,mana:5,dmg:33,range:150,spells:[
  {slot:1,id:"A033",name:"Azure Dragon Fist",key:"Q",lvl:2,tip:"- Water Damage|r"},
  {slot:2,id:"A03F",name:"Azure Dragon Break",key:"W",lvl:6,tip:"- Water Damage|r"},
  {slot:3,id:"A05M",name:"Azure Counter",key:"E",lvl:12,tip:"- Evasion passive|r"},
  {slot:4,id:"A05O",name:"Hidden Dragon Rises",key:"R",lvl:20,tip:"- Water Damage|r"},
  {slot:5,id:"A05N",name:"Dragon Descends",key:"T",lvl:35,tip:"- Massive Water Damage|r"}
]}
];

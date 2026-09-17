/* ============================================================
   projectsData.js — Projects Portfolio Data
   ============================================================
   Contains categorized projects data:
     - drawings (image type) — Imported real drawing images
     - threeDModels (video type with YouTube links + parts breakdown)
     - sheetMetal (video type with YouTube links + parts breakdown)
   ============================================================ */

import boltFlange from '../assets/drawings/3-bolt mounting flange.png';
import flange from '../assets/drawings/FLANGE.png';
import ironMan from '../assets/drawings/IRON MAN.png';
import linkPlate from '../assets/drawings/Link Plate.png';

// Bench Vice Real Parts Imports
import barGlobe from '../assets/bench_vice/Bar Globe.png';
import basePlate from '../assets/bench_vice/Base Plate.png';
import base from '../assets/bench_vice/Base.png';
import clipingPlate from '../assets/bench_vice/Cliping Plate.png';
import jawScrew from '../assets/bench_vice/Jaw Screw.png';
import ovel from '../assets/bench_vice/Ovel.png';
import screwBar from '../assets/bench_vice/Screw Bar.png';
import setScrew from '../assets/bench_vice/Set screw.png';
import wiseJack from '../assets/bench_vice/Wise Jack.png';

// Electrical Enclosure Real Parts Imports
import enclosureBody from '../assets/electrical_enclosure/Body.png';
import enclosureBodyFlat from '../assets/electrical_enclosure/Body flat.png';
import enclosureDoor from '../assets/electrical_enclosure/Door.png';

const projectsData = {
  drawings: [
    {
      id: 'd1',
      title: '3-Bolt Mounting Flange',
      thumbnail: boltFlange,
      type: 'image',
    },
    {
      id: 'd2',
      title: 'Flange Drawing',
      thumbnail: flange,
      type: 'image',
    },
    {
      id: 'd3',
      title: 'Iron Man Technical Artwork',
      thumbnail: ironMan,
      type: 'image',
    },
    {
      id: 'd4',
      title: 'Link Plate Component',
      thumbnail: linkPlate,
      type: 'image',
    },
  ],
  threeDModels: [
    {
      id: 'm1',
      title: 'Housing Assembly',
      youtubeUrl: 'https://youtu.be/GWEpdlt3KkI?si=4JiZngRZU1WLGx7I',
      type: 'video',
      parts: [
        {
          id: 'p1_1',
          name: 'Main Housing Body',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Main+Housing+Body',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Main+Housing+Body+Drawing',
        },
        {
          id: 'p1_2',
          name: 'Helical Drive Gear',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Helical+Drive+Gear',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Helical+Drive+Gear+Drawing',
        },
        {
          id: 'p1_3',
          name: 'Input Shaft Flange',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Input+Shaft+Flange',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Input+Shaft+Flange+Drawing',
        },
        {
          id: 'p1_4',
          name: 'Bearing Retainer Cap',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Bearing+Retainer+Cap',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Bearing+Retainer+Cap+Drawing',
        },
      ],
    },
    {
      id: 'm2',
      title: 'Flanged Housing',
      youtubeUrl: 'https://youtu.be/xKAN4wcI03Y?si=u3ectbZxARb63bjv',
      type: 'video',
      parts: [
        {
          id: 'p2_1',
          name: 'Base Support Plate',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Base+Support+Plate',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Base+Support+Plate+Drawing',
        },
        {
          id: 'p2_2',
          name: 'Vertical Pivot Arm',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Vertical+Pivot+Arm',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Vertical+Pivot+Arm+Drawing',
        },
        {
          id: 'p2_3',
          name: 'Locking Hinge Pin',
          partImage: 'https://placehold.co/400x400/333333/ffffff.png?text=Locking+Hinge+Pin',
          drawingImage: 'https://placehold.co/600x800/1a1a1a/cccccc.png?text=Locking+Hinge+Pin+Drawing',
        },
      ],
    },
    {
      id: 'm3',
      title: 'Bench Vice',
      youtubeUrl: 'https://youtu.be/g8jmwnhf_Cc?si=3XGil6LtLqqVowU1',
      type: 'video',
      parts: [
        {
          id: 'bv_1',
          name: 'Base',
          partImage: base,
          drawingImage: base,
        },
        {
          id: 'bv_2',
          name: 'Base Plate',
          partImage: basePlate,
          drawingImage: basePlate,
        },
        {
          id: 'bv_3',
          name: 'Vice Jack',
          partImage: wiseJack,
          drawingImage: wiseJack,
        },
        {
          id: 'bv_4',
          name: 'Jaw Screw',
          partImage: jawScrew,
          drawingImage: jawScrew,
        },
        {
          id: 'bv_5',
          name: 'Screw Bar',
          partImage: screwBar,
          drawingImage: screwBar,
        },
        {
          id: 'bv_6',
          name: 'Bar Globe',
          partImage: barGlobe,
          drawingImage: barGlobe,
        },
        {
          id: 'bv_7',
          name: 'Clamping Plate',
          partImage: clipingPlate,
          drawingImage: clipingPlate,
        },
        {
          id: 'bv_8',
          name: 'Oval Plate',
          partImage: ovel,
          drawingImage: ovel,
        },
        {
          id: 'bv_9',
          name: 'Set Screw',
          partImage: setScrew,
          drawingImage: setScrew,
        },
      ],
    },
  ],
  sheetMetal: [
    {
      id: 's1',
      title: 'Electrical Enclosure Assembly',
      youtubeUrl: 'https://youtu.be/Wj7w58TsAeA?si=6WOWdK9L_eTAOoGS',
      type: 'video',
      parts: [
        {
          id: 'ee_1',
          name: 'Enclosure Body',
          partImage: enclosureBody,
          drawingImage: enclosureBody,
        },
        {
          id: 'ee_2',
          name: 'Body Flat Pattern',
          partImage: enclosureBodyFlat,
          drawingImage: enclosureBodyFlat,
        },
        {
          id: 'ee_3',
          name: 'Enclosure Door',
          partImage: enclosureDoor,
          drawingImage: enclosureDoor,
        },
      ],
    },
  ],
};

export default projectsData;

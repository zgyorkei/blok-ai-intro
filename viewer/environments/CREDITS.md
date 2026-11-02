# Environment panoramas

360° equirectangular panoramas used as the surroundings in the 3D views. All
come from [Poly Haven](https://polyhaven.com) and are licensed
[CC0](https://polyhaven.com/license): free to use, modify and redistribute,
with no attribution required. They are credited here anyway.

Each was downloaded as Poly Haven's tonemapped JPG and downscaled to
4096 × 2048 (`<id>.jpg`, JPEG quality 85) plus a 480 × 240 thumbnail
(`<id>-thumb.jpg`) for the picker.

| File | Poly Haven asset | Author |
| --- | --- | --- |
| `stuttgart_suburbs` | [Stuttgart Suburbs](https://polyhaven.com/a/stuttgart_suburbs) | Andreas Mischok |
| `urban_street_01` | [Urban Street 01](https://polyhaven.com/a/urban_street_01) | Andreas Mischok |
| `urban_courtyard_02` | [Urban Courtyard 02](https://polyhaven.com/a/urban_courtyard_02) | Sergej Majboroda |
| `quattro_canti` | [Quattro Canti](https://polyhaven.com/a/quattro_canti) | Andreas Mischok |
| `canary_wharf` | [Canary Wharf](https://polyhaven.com/a/canary_wharf) | Andreas Mischok |
| `german_town_street` | [German Town Street](https://polyhaven.com/a/german_town_street) | Alexander Scholten |
| `charolettenbrunn_park` | [Charolettenbrunn Park](https://polyhaven.com/a/charolettenbrunn_park) | Grzegorz Wronkowski |
| `spree_bank` | [Spree Bank](https://polyhaven.com/a/spree_bank) | Alexander Scholten |
| `autumn_hilly_field` | [Autumn Hilly Field](https://polyhaven.com/a/autumn_hilly_field) | Grzegorz Wronkowski |
| `simons_town_harbour` | [Simon's Town Harbour](https://polyhaven.com/a/simons_town_harbour) | Greg Zaal, Rico Cilliers |

To add one: pick an outdoor, street-level, daytime panorama on Poly Haven,
download its tonemapped JPG, write the two sizes above, and add an entry to
`src/data/environments.ts`.

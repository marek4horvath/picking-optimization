
# Picking Optimization API

## Project description

This project provides an HTTP API for warehouse product picking optimization.
The goal is to minimize the distance/time required for a worker to collect all products in an order.

The algorithm combines:

    1. Greedy – fast initial solution.  
    2. 2-opt heuristic – optimization of picking order for a shorter route.  

### Installation and local run
    npm install

### Run server
    npm run dev
Server runs on port: 3000

### Environment Setup
Copy the .env.example file to .env:

    cp .env.example .env

Fill in your own values:

    GYMBEAM_API_KEY=your_api_key_here
    GYMBEAM_API_URL=https://api.gymbeam.io/case-study-picking-optimization


## API Endpoints
    URL: http://localhost:3000/optimize-picking
    Metóda: POST
    Request body:
    {
        "products": ["product-1", "product-2", "product-3"],
        "startingPosition": { "x": 0, "y": 0, "z": 0 }
    }

- products: array of strings – identifiers of products to pick
- startingPosition: Point3D object
    * x: X coordinate in warehouse
    * y: Y coordinate in warehouse
    * z: floor level
##

    Response body:
    {
        "distance": 97,
        "pickingOrder": [
            { "productId": "product-1", "positionId": "position-31"},
            { "productId": "product-3", "positionId": "position-120" },
            { "productId": "product-2", "positionId": "position-241" }
        ]
    }

- distance – total walking distance of the worker (rounded)
- pickingOrder – array of products with specific positions and coordinates

##### Error responses:

- 400 – invalid request or product has no available positions
- 500 – internal server error
- API_KEY error in .env
- GYMBEAM_API_URL error in .env

## Optimization algorithm – optimizedPicking

## Description

- Greedy Algorithm
    * Always pick the closest not-yet-picked product to the current position.
    * This algorithm is fast (O(n²)).
    * Used as a starting solution for further optimization.

- 2-Opt Optimization
    * 2-Opt is a classical heuristic from the Traveling Salesman Problem (TSP).
    * Idea: takes a section of the path between two points and turns it around. If this shortens the route, the change is kept.
    * Repeated until no more improvements are found.

####
    Steps:

    1. Start with greedy route.
    2. Select indices i and k.
    3. Reverse the segment between them.
    4. If new route is shorter → accept it.
    5. Repeat until no more improvements.

### Inputs:
- positionsByProduct: Map<string, ProductPosition[]> – mapping product → available positions
- startingPosition: Point3D – starting worker position

### Outputs:

OptimizeResponse


    {
        distance: number,
        pickingOrder: PickingItem[]
    }


- distance – distance after optimization
- pickingOrder – array of PickingItem objects with productId and positionId

## Conclusion
This project provides a simple and efficient solution for optimizing warehouse product picking routes using Greedy algorithm and 2-opt heuristic.



# Picking Optimization API

## Popis projektu

Tento projekt poskytuje HTTP API pre optimalizáciu vychystávania produktov v sklade.  
Cieľom je minimalizovať vzdialenosť/čas, ktorý pracovník potrebuje na vyzdvihnutie všetkých produktov v objednávke.  

Algoritmus kombinuje:

    1. Greedy – rýchle počiatočné riešenie.  
    2. 2-opt heuristiku – optimalizácia poradia zbierania produktov pre kratšiu trasu.  

#### Inštalácia a spustenie lokálne
    npm install

##### Spustenie servera
    npm run dev
Server beží na porte: 3000

### Nastavenie prostredia
Skopírujte súbor .env.example do .env:
    
    cp .env.example .env

Doplnte vlastné hodnoty:

    GYMBEAM_API_KEY=your_api_key_here
    GYMBEAM_API_URL=https://api.gymbeam.io/case-study-picking-optimization

## API Endpoints
    URL: http://localhost:3000/optimize-picking
    Metóda: POST
    Request body:
    {
        "products": ["product-1", "product-2", "product-3"],
        "startingPosition": { "x": 0, "y": 0, "z": 0 }
    }

- products: pole reťazcov – identifikátory produktov, ktoré  treba vyzdvihnúť.
- startingPosition: objekt typu Point3D
  * x: súradnica X v sklade
  * y: súradnica Y v sklade
  * z: poschodie
######

    Response body:
    {
        "distance": 97,
        "pickingOrder": [
            { "productId": "product-1", "positionId": "position-31"},
            { "productId": "product-3", "positionId": "position-120" },
            { "productId": "product-2", "positionId": "position-241" }
        ]
    }

- distance – celková vzdialenosť chôdze pracovníka (zaokrúhlená).
- pickingOrder – pole produktov s konkrétnymi pozíciami a súradnicami.

##### Chybové stavy:
- 400 – neplatný request alebo produkt nemá dostupné pozície
- 500 – interná chyba servera
- API_KEY error in .env
- GYMBEAM_API_URL error in .env

## Algoritmus optimalizácie – optimizedPicking

## Popis 

- Greedy Algorithm
    * Vždy sa vyberie najbližší ešte nezobratý produkt k aktuálnej pozícii.
    * Tento algoritmus je rýchly (O(n²)).
    * Používa sa ako štartovacie riešenie pre ďalšie optimalizácie.

- 2-Opt Optimization
    * 2-Opt je klasická heuristika z Traveling Salesman Problem (TSP).
    * Idea: vezme sa časť cesty medzi dvoma bodmi a otočí sa. Ak sa tým trasa skráti, zmena sa ponechá.
    * Opakuje sa, kým sa nenájde žiadne ďalšie zlepšenie.
####
    Kroky:

    1. Začne s greedy trasou.
    2. Vyber indexy i a k.
    3. Otoč úsek medzi nimi.
    4. Ak nová trasa je kratšia → akceptuj.
    5. Opakuj, kým už nie sú zlepšenia.

### Vstupy:
 - positionsByProduct: Map<string, ProductPosition[]> – mapovanie produkt → dostupné pozície

 - startingPosition: Point3D – počiatočná pozícia pracovníka

 ### Výstupy:
 OptimizeResponse


    {
        distance: number,
        pickingOrder: PickingItem[]
    }

- distance – vzdialenosť po optimalizácii
- pickingOrder – pole objektov PickingItem s productId a positionId


## Záver

Tento projekt poskytuje jednoduché a efektívne riešenie pre optimalizáciu trasy vychystávania produktov v sklade s využitím Greedy algoritmu a 2-opt heuristiky.

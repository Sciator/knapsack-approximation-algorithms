
- n -> Počet předmětů
- max_p -> Maximální zisk jednoho předmětu
- max_s -> Maximální velikost
- sort -> výchozí řazení
- randomness -> náhodnost s vlastnostmi:
  - type -> druh náhodnosti
  - value -> míra aplikace náhodnosti
- max_B -> maximální velikost batohu



- vygeneruje posloupnost zisků, 
  tak že vybere n náhodných hodnot p_i z {0, max_p} a s_i z {0, max_p}
- hodnoty s_i setřídí
- Podle hodnoty sort:
  - random nedělá nic (nechá p_i nesetříděné)
  - same setřídí hodnoty p_i stejným způsobem jako s_i
  - reversed setřídí hodnoty p_i opačným způsobem jako s_i
- Pokud sort není random aplikuje náhodnost následovně:
  - Prohazuje čísla pro druh náhodnosti:
    TODO:


# Todo:
- [X] vizualizace všech měření pomocí pyplotu
- [ ] zkontrolovat jestli je implementovaný algoritmus stejný s algoritmem na stránkách vyučujícího
- [ ] dodělání různého parametru pro fptas (podle zadání)
- [ ] komentář k výsledkům měření
- [ ] readme - napsat jak spustit a další podrobnosti
- [ ] odstranit zbytečný kód
- [ ] když zbyde čas tak provést měření na více PC
- [ ] smazat git historii


Zadání
1. Naprogramujte FPTAS pro problém batohu (pseudokód je součástí prezentace na mých stránkách) 
2. Porovnejte délky běhu algoritmu pro různé hodnoty epsilon a různé délky vstupu (vhodně zvolte) 
    s běžnou variantou řešenou pomocí dynamického programování (pro nalezení optimálního řešení).
3. Výsledky vhodně okomentujte a interpretujte ve formě grafů.

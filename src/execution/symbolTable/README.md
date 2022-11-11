# Scope

## Layered Map

A tree data structure where each node contains a key-value dictionary. A projection from any node
yields a flat key-value dictionary which contains the keys with their values in the node's key-value
dictionary augmented with all new keys and values encounter while parsing up to the root node. If a
key is present in multiple nodes, the value in the lowest node is taken; in essence, child keys shadow
ancestor keys.

This data structure is intended to address the scoping problem, where a scope contains all unique
members of the scope and all other unique members of its ancestors; if two levels have same keys,
the yongest value is taken.

### Example

```text
K1    K2   K3   K4   K5   K6   K7   K8      K9   KA
========================== A ========================
| a -- b -- c -- d ------- i                        |  1
=====================================================
          ====== B ======     ==== D ===   ==== E ===
          | e -- f -- h |     | j -- k |   | l -----|  2
          ===============     ==========   ==========
               = C =                            = F =
               | g |                            | m |  3
               =====                            =====
```

`A`, `B`, `C`, `D`, `E`, `F` are the nodes.

```text
key-values of A: K1(a), K2(b), K3(c), K4(d), K6(i)
key-values of B:               K3(e), K4(f), K5(h)
key-values of C:                      K4(g)
key-values of D:                                    K7(j), K8(k)
key-values of E:                                                  K9(l)
key-values of F:                                                  KA(m)

projecting from A returns: K1(a), K2(b), K3(c), K4(d),        K6(i)
projecting from B returns: K1(a), K2(b), K3(e), K4(f), K5(h), K6(i)
projecting from C returns: K1(a), K2(b), K3(e), K4(g), K5(h), K6(i)
projecting from D returns: K1(a), K2(b), K3(c), K4(d),        K6(i), K7(j), K8(k)
projecting from E returns: K1(a), K2(b), K3(c), K4(d),        K6(i),               K9(l)
projecting from F returns: K1(a), K2(b), K3(c), K4(d),        K6(i),               K9(l), KA(m)
```

## Context

Context.

## Symbol Table

Symbol Table.

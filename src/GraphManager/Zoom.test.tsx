import {
  zoomStep,
  ZoomDirection,
  calculateNodeWeight,
  GraphDataMerged,
  ZoomArgs,
  LinkBetweenHasIDs,
  HasID,
  ZoomOperationType,
  ZoomState,
} from "./Zoom";

describe("zoom", () => {
  describe("meta", () => {
    it("should store operations done zooming out int args object", () => {
      const [A, B] = [{ id: "A" }, { id: "B" }];
      const link = { source: B, target: A };
      let args: ZoomArgs = {
        steps: 1,
        direction: ZoomDirection.Out,
        graphData: { nodes: [A, B], links: [link] },
      };
      let state: ZoomState = {
        zoomOperations: [],
      };
      zoomStep(args, state);
      expect(state.zoomOperations).toEqual([
        {
          type: ZoomOperationType.Merge,
          removedNodes: [B],
          removedLinks: [link],
        },
      ]);
    });
  });

  describe("out", () => {
    const rawData = [
      { id: "A" },
      { id: "A5", mergeCount: 5 },
      { id: "B" },
      { id: "B16", mergeCount: 16 },
      { id: "C" },
      { id: "D" },
      { id: "E" },
      { id: "F" },
      { id: "G" },
    ];
    let nodeList = rawData.map((node) => ({
      id: node.id,
      mergeCount: node.mergeCount,
    }));
    let node = Object.assign(
      // @ts-ignore
      ...nodeList.map((node) => ({ [node.id]: node }))
    );
    it.each([
      [
        // test name
        "zoom a single step",
        // input state visualized:
        "A -> B <- C",
        // expected output state visualized:
        "B <- C",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C],
            links: [
              { source: node.A, target: node.B },
              { source: node.C, target: node.B },
            ],
          },
        },
        {
          nodes: [{ ...node.B, mergeCount: 2 }, node.C],
          links: [{ source: node.C, target: node.B }],
        },
      ],
      [
        "do nothing when steps == 0",
        "A -> B",
        "A -> B",
        {
          steps: 0,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B],
            links: [{ source: node.A, target: node.B }],
          },
        },
        {
          nodes: [node.A, node.B],
          links: [{ source: node.A, target: node.B }],
        },
      ],
      [
        "do nothing when no nodes can be deleted",
        "A; B",
        "A; B",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B],
            links: [],
          },
        },
        {
          nodes: [node.A, node.B],
          links: [],
        },
      ],
      [
        "zoom 2 steps",
        "A -> B <- C",
        "B",
        {
          steps: 2,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C],
            links: [
              { source: node.A, target: node.B },
              { source: node.C, target: node.B },
            ],
          },
        },
        { nodes: [{ ...node.B, mergeCount: 3 }], links: [] },
      ],
      [
        "cannot zoom in further than the amount of nodes available",
        "A -> B <- C",
        "A -> B <- C",
        {
          steps: 3,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C],
            links: [
              { source: node.A, target: node.B },
              { source: node.C, target: node.B },
            ],
          },
        },
        {
          nodes: [node.A, node.B, node.C],
          links: [
            { source: node.A, target: node.B },
            { source: node.C, target: node.B },
          ],
        },
      ],
      [
        "rewrite links to merged nodes",
        "A -> B -> C <- D",
        "A -> C",
        {
          steps: 2,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.A, target: node.B },
              { source: node.B, target: node.C },
              { source: node.D, target: node.C },
            ],
          },
        },
        {
          nodes: [node.A, node.C],
          links: [{ source: node.A, target: node.C }],
        },
      ],
      [
        "preserve forward links",
        "A -> B <- C; B -> D",
        "B -> D",
        {
          steps: 2,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.A, target: node.B },
              { source: node.C, target: node.B },
              { source: node.B, target: node.D },
            ],
          },
        },
        {
          nodes: [node.B, node.D],
          links: [{ source: node.B, target: node.D }],
        },
      ],
      [
        "choose mergeTargetNode by node order on equal weight",
        "A -> B; C -> D",
        "B; C -> D",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.A, target: node.B },
              { source: node.C, target: node.D },
            ],
          },
        },
        {
          nodes: [node.B, node.C, node.D],
          links: [{ source: node.C, target: node.D }],
        },
      ],
      [
        "removed node's links, must be moved",
        "A <- B -> C <- D",
        "A <- C <- D",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.B, target: node.A },
              { source: node.B, target: node.C },
              { source: node.D, target: node.C },
            ],
          },
        },
        {
          nodes: [node.A, node.C, node.D],
          links: [
            { source: node.C, target: node.A },
            { source: node.D, target: node.C },
          ],
        },
      ],
      [
        "remove duplicate links, after link target forwarding (secondOrderTargetLinks)",
        // Note: got to complex due to other changes to the zoomStep function
        // 1. ensure that C stays mergeTargetNode: B -2-> C
        // 2. ensure A gets deleted (lower node-weight, than B): D -2-> A
        "D -2-> A -> B -2-> C; A -> C",
        "D -2-> A -> C",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.B, target: node.C, value: 2 },
              { source: node.A, target: node.B },
              { source: node.A, target: node.C },
              { source: node.D, target: node.A, value: 2 },
            ],
          },
        },
        {
          nodes: [node.A, node.C, node.D],
          links: [
            { source: node.A, target: node.C },
            { source: node.D, target: node.A, value: 2 },
          ],
        },
      ],
      [
        "remove duplicate links, after link source forwarding (secondOrderSourceLinks)",
        "D <- A -> B <- C; B -> D",
        "D <- B <- C",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.A, target: node.D },
              { source: node.B, target: node.D },
              { source: node.A, target: node.B },
              { source: node.C, target: node.B },
            ],
          },
        },
        {
          nodes: [node.B, node.C, node.D],
          links: [
            { source: node.B, target: node.D },
            { source: node.C, target: node.B },
          ],
        },
      ],
      [
        "select deleted nodes by weight (1/2)",
        "A -2-> B -2-> C <-2- D <- E",
        "A -> B -> C <- E",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D, node.E],
            links: [
              { source: node.A, target: node.B, value: 2 },
              { source: node.B, target: node.C, value: 2 },
              { source: node.D, target: node.C, value: 2 },
              { source: node.E, target: node.D },
            ],
          },
        },
        {
          nodes: [node.A, node.B, node.C, node.E],
          links: [
            { source: node.A, target: node.B, value: 2 },
            { source: node.B, target: node.C, value: 2 },
            { source: node.E, target: node.C },
          ],
        },
      ],
      [
        "select deleted nodes by weight (2/2)",
        "A -> B -2-> C <-2- D <-2- E",
        "A -> C <- D <- E",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D, node.E],
            links: [
              { source: node.A, target: node.B },
              { source: node.B, target: node.C, value: 2 },
              { source: node.D, target: node.C, value: 2 },
              { source: node.E, target: node.D, value: 2 },
            ],
          },
        },
        {
          nodes: [node.A, node.C, node.D, node.E],
          links: [
            { source: node.A, target: node.C },
            { source: node.D, target: node.C, value: 2 },
            { source: node.E, target: node.D, value: 2 },
          ],
        },
      ],
      [
        "doubly outgoing links on first order deleted nodes",
        "A <- B -> C",
        "A -> C",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C],
            links: [
              { source: node.B, target: node.A },
              { source: node.B, target: node.C },
            ],
          },
        },
        {
          nodes: [node.A, node.C],
          links: [{ source: node.A, target: node.C }],
        },
      ],
      [
        "self-linking node with otherwise only source links",
        "A -10-> A; C <- A -> B",
        "solution: self-linking is not allowed",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C],
            links: [
              { source: node.A, target: node.A, value: 10 },
              { source: node.A, target: node.B, value: 2 },
              { source: node.A, target: node.C, value: 2 },
            ],
          },
        },
        {
          nodes: [/*node.A,*/ node.B, node.C],
          links: [
            //{ source: node.A, target: node.A, value: 10 },
            //{ source: node.A, target: node.B, value: 2 },
            //{ source: node.A, target: node.C, value: 2 },
          ],
        },
      ],
      [
        "2 zoom steps in separated graph (enforce recursion)",
        "A -> B; C -> D",
        "B; D",
        {
          steps: 2,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.A, target: node.B },
              { source: node.C, target: node.D },
            ],
          },
        },
        {
          nodes: [node.B, node.D],
          links: [],
        },
      ],
      [
        "remove self-referencing links after link rewriting",
        "D -1.5-> A -> B <-> C",
        "D -1.5-> A -> B",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D],
            links: [
              { source: node.D, target: node.A, value: 1.5 },
              { source: node.A, target: node.B },
              { source: node.B, target: node.C },
              { source: node.C, target: node.B },
            ],
          },
        },
        {
          nodes: [node.A, node.B, node.D],
          links: [
            { source: node.D, target: node.A, value: 1.5 },
            { source: node.A, target: node.B },
          ],
        },
      ],
      [
        "propagate mergeCount number",
        "A{mergeCount: 3} -> B",
        "B{mergeCount: 4}",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [{ ...node.A, mergeCount: 3 }, node.B],
            links: [{ source: { ...node.A, mergeCount: 3 }, target: node.B }],
          },
        },
        {
          nodes: [{ ...node.B, mergeCount: 4 }],
          links: [],
        },
      ],
      [
        "integration test with many nodes and links",
        "G -> A -> B <- C; B -> D <- E; A -> F -> D",
        "B",
        {
          steps: 6,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D, node.E, node.F, node.G],
            links: [
              { source: node.G, target: node.A },
              { source: node.A, target: node.B },
              { source: node.A, target: node.F },
              { source: node.C, target: node.B },
              { source: node.B, target: node.D },
              { source: node.E, target: node.D },
              { source: node.F, target: node.D },
            ],
          },
        },
        {
          nodes: [node.D],
          links: [],
        },
      ],
      [
        "merge non-merged nodes before merging more nodes into already merged nodes",
        // Explanation:
        // links to G and F ensure, that they are not removed, so that either B
        // has most links next to the mergeTarget C, but B has a high
        // mergeCount, so D must be removed instead
        "A[5] -> B[16] -> C <- D <- E; G -> C <- F -> D; A -> G <- B; A -> F <- B",
        "A[5] -> B[16] -> C <- E; G -> C <- F -> C",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A5, node.B16, node.C, node.D, node.E, node.F, node.G],
            links: [
              { source: node.A5, target: node.B16 },
              { source: node.B16, target: node.C },
              { source: node.D, target: node.C },
              { source: node.E, target: node.D },
              { source: node.G, target: node.C },
              { source: node.F, target: node.C },
              { source: node.F, target: node.D },
              { source: node.A5, target: node.G },
              { source: node.B16, target: node.G },
              { source: node.A5, target: node.F },
              { source: node.B16, target: node.F },
            ],
          },
        },
        {
          nodes: [node.A5, node.B16, node.C, node.E, node.F, node.G],
          links: [
            { source: node.A5, target: node.B16 },
            { source: node.B16, target: node.C },
            { source: node.E, target: node.C },
            { source: node.G, target: node.C },
            { source: node.F, target: node.C /*, value: 2*/ }, // TODO(skep): duplicate links should merge their value!
            { source: node.A5, target: node.G },
            { source: node.B16, target: node.G },
            { source: node.A5, target: node.F },
            { source: node.B16, target: node.F },
          ],
        },
      ],
      [
        "select non-merged nodes as merge target before already merged ones",
        "B[16] <- C <- D",
        "B[16] <- C[2]",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.B16, node.C, node.D],
            links: [
              { source: node.C, target: node.B16 },
              { source: node.D, target: node.C },
            ],
          },
        },
        {
          nodes: [node.B16, node.C],
          links: [{ source: { ...node.C, mergeCount: 2 }, target: node.B16 }],
        },
      ],
      [
        "duplicate links to side-nodes should average their values",
        "E <-> D -2-> C -> B <-3- A -> C; E -3-> C",
        "E <-> D -2-> C -2-> B; E -3-> C",
        {
          steps: 1,
          direction: ZoomDirection.Out,
          graphData: {
            nodes: [node.A, node.B, node.C, node.D, node.E],
            links: [
              { source: node.E, target: node.D },
              { source: node.E, target: node.C, value: 3 },
              { source: node.D, target: node.E },
              { source: node.D, target: node.C, value: 2 },
              { source: node.C, target: node.B },
              { source: node.A, target: node.B, value: 3 },
              { source: node.A, target: node.C },
            ],
          },
        },
        {
          nodes: [node.B, node.C, node.D, node.E],
          links: [
            { source: node.E, target: node.D },
            { source: node.E, target: node.C, value: 3 },
            { source: node.D, target: node.E },
            { source: node.D, target: node.C, value: 2 },
            { source: node.C, target: node.B, value: 2 },
          ],
        },
      ],
      //[
      //  "name",
      //  "A -> B",
      //  "A -> B",
      //  {
      //    steps: ?,
      //    direction: ZoomDirection.Out,
      //    graphData: { nodes: [], links: [] },
      //  },
      //  { nodes: [], links: [] },
      //],
    ])(
      "%s: should merge %p to %p",
      (
        _test_name: string,
        _from: string,
        _to: string,
        input: ZoomArgs,
        expected: GraphDataMerged
      ) => {
        // reset mutable data on node set (cannot use `beforeEach` due to
        // `it.each` usage)
        input.graphData.nodes.forEach((node) => {
          node.mergeCount = rawData.find(
            (rawNode) => node.id === rawNode.id
          )?.mergeCount;
        });
        zoomStep(input, { zoomOperations: [] });
        expect(input.graphData).toEqual(expected);
      }
    );
  });

  describe("in", () => {
    const rawData = [
      { id: "A" },
      { id: "A5", mergeCount: 5 },
      { id: "B" },
      { id: "B16", mergeCount: 16 },
      { id: "C" },
      { id: "D" },
      { id: "E" },
      { id: "F" },
      { id: "G" },
    ];
    let nodeList = rawData.map((node) => ({
      id: node.id,
      mergeCount: node.mergeCount,
    }));
    let node = Object.assign(
      // @ts-ignore
      ...nodeList.map((node) => ({ [node.id]: node }))
    );
    it.each([
      [
        "zoom in a single step",
        "A, [Merge(B into A)]",
        "A <- B",
        {
          steps: 1,
          direction: ZoomDirection.In,
          graphData: {
            nodes: [node.A],
            links: [],
          },
        },
        {
          zoomOperations: [
            {
              type: ZoomOperationType.Merge,
              removedNodes: [node.B],
              removedLinks: [{ source: node.B, target: node.A }],
            },
          ],
        },
        {
          nodes: [node.A, node.B],
          links: [{ source: node.B, target: node.A }],
        },
      ],
    ])(
      "%s: should un-merge %p to %p",
      (
        _test_name: string,
        _from: string,
        _to: string,
        input: ZoomArgs,
        state: ZoomState,
        expected: GraphDataMerged
      ) => {
        zoomStep(input, state);
        expect(input.graphData).toEqual(expected);
      }
    );
    it.todo("should reduce mergeCount on nodes, when un-merging");
    it.todo("should rewrite links, that were rewritten on merge");
    it.todo("must re-create exactly the same graph");
  });
});

describe("calculateNodeWeight", () => {
  const nodeList = [{ id: "A" }, { id: "B" }, { id: "C" }];
  // @ts-ignore: oh come on
  let node = Object.assign(...nodeList.map((node) => ({ [node.id]: node })));
  it.each([
    [
      "count links to node",
      [
        { source: node.A, target: node.B },
        { source: node.B, target: node.A },
        { source: node.C, target: node.A },
      ],
      [
        { node: node.C, expectedWeight: 0 },
        { node: node.B, expectedWeight: 1 },
        { node: node.A, expectedWeight: 2 },
      ],
    ],
    [
      "weight each link by link.value",
      [
        { source: node.A, target: node.B, value: 2 },
        { source: node.B, target: node.A, value: 3 },
        { source: node.C, target: node.A, value: 0.5 },
      ],
      [
        { node: node.C, expectedWeight: 0 },
        { node: node.B, expectedWeight: 2 },
        { node: node.A, expectedWeight: 3.5 },
      ],
    ],
  ])(
    "should %s",
    (
      _test_name: string,
      links: LinkBetweenHasIDs[],
      assertions: { node: HasID; expectedWeight: number }[]
    ) => {
      assertions.forEach(({ node, expectedWeight }) => {
        expect(calculateNodeWeight(node, links)).toEqual(expectedWeight);
      });
    }
  );
});

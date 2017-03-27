;(function(undefined) {
  'use strict';

  if (typeof sigma === 'undefined')
    throw 'sigma is not declared';

  // Initialize packages:
  sigma.utils.pkg('sigma.misc');

  /**
   * This method listens to "overNode", "outNode", "overEdge" and "outEdge"
   * events from a renderer and renders the nodes differently on the top layer.
   * The goal is to make any node label readable with the mouse, and to
   * highlight hovered nodes and edges.
   *
   * It has to be called in the scope of the related renderer.
   */
  sigma.misc.drawHovers = function(prefix) {
    var self = this,
        lastMouseMoveEvent,
        hoveredNodes = {},
        hoveredEdges = {};

    this.bind('overNode', function(event) {
      var node = event.data.node;
      if (!node.hidden) {
        hoveredNodes[node.id] = node;
        draw();
      }
    });

    this.bind('outNode', function(event) {
      delete hoveredNodes[event.data.node.id];
      draw();
    });

    // BK: need to thave the current mouse position so that
    // the nearest node can be found for hovering
    this.bind('mousemove', function(event) {
      lastMouseMoveEvent = event
    });

    this.bind('overEdge', function(event) {
      var edge = event.data.edge;
      if (!edge.hidden) {
        hoveredEdges[edge.id] = edge;
        draw();
      }
    });

    this.bind('outEdge', function(event) {
      delete hoveredEdges[event.data.edge.id];
      draw();
    });

    this.bind('render', function(event) {
      draw();
    });


    // BK: select node for hovering by looking at
    // z coordinates and distances to the nodes
    function selectHoveredNode() {
      var mX = lastMouseMoveEvent.data.x,
          mY = lastMouseMoveEvent.data.y,
          modifiedX = mX + self.width / 2,
          modifiedY = mY + self.height / 2,
          best_z = Infinity, // in fact 1 is max
          best_d2 = Infinity,
          k,
          selected;
      for (k in hoveredNodes) {
        var z = hoveredNodes[k].z || 0,
            dx = hoveredNodes[k].x - modifiedX,
            dy = hoveredNodes[k].y - modifiedY,
            d2 = dx * dx + dy * dy;
        if (z < best_z) {
          best_z = z;
          best_d2 = d2;
          selected = k;
        }
        else if (z === best_z) {
          if (d2 < best_d2) {
            best_d2 = d2;
            selected = k;
          }
        }
      }
      return selected
    }

    function draw() {

      var k,
          source,
          target,
          hoveredNode,
          hoveredEdge,
          c = self.contexts.hover.canvas,
          defaultNodeType = self.settings('defaultNodeType'),
          defaultEdgeType = self.settings('defaultEdgeType'),
          nodeRenderers = sigma.canvas.hovers,
          edgeRenderers = sigma.canvas.edgehovers,
          extremitiesRenderers = sigma.canvas.extremities,
          embedSettings = self.settings.embedObjects({
            prefix: prefix
          });

      // Clear self.contexts.hover:
      self.contexts.hover.clearRect(0, 0, c.width, c.height);

      // Node render: single hover
      if (
        embedSettings('enableHovering') &&
        embedSettings('singleHover') &&
        Object.keys(hoveredNodes).length
      ) {
        //hoveredNode = hoveredNodes[Object.keys(hoveredNodes)[0]];
        hoveredNode = hoveredNodes[selectHoveredNode()];
        (
          nodeRenderers[hoveredNode.type] ||
          nodeRenderers[defaultNodeType] ||
          nodeRenderers.def
        )(
          hoveredNode,
          self.contexts.hover,
          embedSettings
        );
      }

      // Node render: multiple hover
      if (
        embedSettings('enableHovering') &&
        !embedSettings('singleHover')
      )
        for (k in hoveredNodes)
          (
            nodeRenderers[hoveredNodes[k].type] ||
            nodeRenderers[defaultNodeType] ||
            nodeRenderers.def
          )(
            hoveredNodes[k],
            self.contexts.hover,
            embedSettings
          );

      // Edge render: single hover
      if (
        embedSettings('enableEdgeHovering') &&
        embedSettings('singleHover') &&
        Object.keys(hoveredEdges).length
      ) {
        hoveredEdge = hoveredEdges[Object.keys(hoveredEdges)[0]];
        source = self.graph.nodes(hoveredEdge.source);
        target = self.graph.nodes(hoveredEdge.target);

        if (! hoveredEdge.hidden) {
          (
            edgeRenderers[hoveredEdge.type] ||
            edgeRenderers[defaultEdgeType] ||
            edgeRenderers.def
          ) (
            hoveredEdge,
            source,
            target,
            self.contexts.hover,
            embedSettings
          );

          if (embedSettings('edgeHoverExtremities')) {
            (
              extremitiesRenderers[hoveredEdge.type] ||
              extremitiesRenderers.def
            )(
              hoveredEdge,
              source,
              target,
              self.contexts.hover,
              embedSettings
            );

          } else {
            // Avoid edges rendered over nodes:
            (
              sigma.canvas.nodes[source.type] ||
              sigma.canvas.nodes.def
            ) (
              source,
              self.contexts.hover,
              embedSettings
            );
            (
              sigma.canvas.nodes[target.type] ||
              sigma.canvas.nodes.def
            ) (
              target,
              self.contexts.hover,
              embedSettings
            );
          }
        }
      }

      // Edge render: multiple hover
      if (
        embedSettings('enableEdgeHovering') &&
        !embedSettings('singleHover')
      ) {
        for (k in hoveredEdges) {
          hoveredEdge = hoveredEdges[k];
          source = self.graph.nodes(hoveredEdge.source);
          target = self.graph.nodes(hoveredEdge.target);

          if (!hoveredEdge.hidden) {
            (
              edgeRenderers[hoveredEdge.type] ||
              edgeRenderers[defaultEdgeType] ||
              edgeRenderers.def
            ) (
              hoveredEdge,
              source,
              target,
              self.contexts.hover,
              embedSettings
            );

            if (embedSettings('edgeHoverExtremities')) {
              (
                extremitiesRenderers[hoveredEdge.type] ||
                extremitiesRenderers.def
              )(
                hoveredEdge,
                source,
                target,
                self.contexts.hover,
                embedSettings
              );
            } else {
              // Avoid edges rendered over nodes:
              (
                sigma.canvas.nodes[source.type] ||
                sigma.canvas.nodes.def
              ) (
                source,
                self.contexts.hover,
                embedSettings
              );
              (
                sigma.canvas.nodes[target.type] ||
                sigma.canvas.nodes.def
              ) (
                target,
                self.contexts.hover,
                embedSettings
              );
            }
          }
        }
      }
    }
  };
}).call(this);

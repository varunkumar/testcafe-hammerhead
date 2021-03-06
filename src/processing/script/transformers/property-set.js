// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

import { createPropertySetWrapper } from '../node-builder';
import { Syntax } from '../tools/esotope';
import { shouldInstrumentProperty } from '../instrumented';

// Transform:
// obj.<wrappable-property> = value -->
// __set$(obj, '<wrappable-property>', value)

export default {
    nodeReplacementRequireTransform: true,

    nodeTypes: [Syntax.AssignmentExpression],

    condition: node => node.operator === '=' &&
                       node.left.type === Syntax.MemberExpression && !node.left.computed &&
                       node.left.property.type === Syntax.Identifier &&
                       shouldInstrumentProperty(node.left.property.name),

    run: node => createPropertySetWrapper(node.left.property.name, node.left.object, node.right)
};

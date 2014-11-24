util = {};

/**
 * Sets up an inheritance chain. Lifted from closure's goog.inherits.
 */
util.inherits = function(subClass, superClass) {
  // Define a dummy ctor.
  function tempCtor() {};
  // Set the proto of that to be the super proto.
  tempCtor.prototype = superClass.prototype;
  // Save the superClass so it is accessible later.
  subClass.superClass_ = superClass.prototype;
  // Set the subClass's proto to be a new object (that has the super proto).
  subClass.prototype = new tempCtor();
  // Now cleanup the constructor property.
  subClass.prototype.constructor = subClass;

  subClass.prototype.base = function(me, methodName, var_args) {
    var args = Array.prototype.slice.call(arguments, 2);
    return superClass.prototype[methodName].apply(me, args);
  };
};

<?php

namespace AntiMattr\GoogleBundle\Analytics;

use Doctrine\Common\Comparable;

class CustomVariable implements Comparable
{
    private $index;
    private $name;
    private $value;
    private $scope = 1;

    public function __construct($index, $name, $value, $scope = 1)
    {
        $this->index = (int) $index;
        $this->name = $name;
        $this->value = $value;
        $this->scope = (int) $scope;
    }

    public function getIndex()
    {
        return $this->index;
    }

    public function getName()
    {
        return $this->name;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function getScope()
    {
        return $this->scope;
    }

    /**
     * @param CustomVariable $object
     * @return integer
     */
    public function compareTo($other)
    {
        if ($this->index !== $other->index) {
            return strcmp($this->index, $other->index);
        }

        if ($this->name !== $other->name) {
            return strcmp($this->name, $other->name);
        }

        if ($this->value !== $other->value) {
            return strcmp($this->value, $other->value);
        }

        if ($this->scope !== $other->scope) {
            return strcmp($this->scope, $other->scope);
        }

        return 0;
    }
}

<?php

namespace AntiMattr\GoogleBundle\Adwords;

class Conversion
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $label;

    /**
     * @var string
     */
    private $value;

    /**
     * @param $id int
     * @param $label string
     * @param $value string
     */
    public function __construct($id, $label, $value)
    {
        $this->id = $id;
        $this->label = $label;
        $this->value = $value;
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getLabel()
    {
        return $this->label;
    }

    /**
     * @return string
     */
    public function getValue()
    {
        return $this->value;
    }
}

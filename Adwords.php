<?php

namespace AntiMattr\GoogleBundle;

use AntiMattr\GoogleBundle\Adwords\Conversion;
use Symfony\Component\DependencyInjection\ContainerInterface;

class Adwords
{
    const CONVERSION_KEY = 'google_adwords/conversion';

    /**
     * @var array
     */
    private $activeConversions;

    /**
     * @var \Symfony\Component\DependencyInjection\ContainerInterface
     */
    private $container;

    /**
     * @var array
     */
    private $conversions;

    /**
     * @param \Symfony\Component\DependencyInjection\ContainerInterface $container
     * @param array $conversions
     */
    public function __construct(ContainerInterface $container, array $conversions = array())
    {
        $this->container = $container;
        $this->conversions = $conversions;
    }

    /**
     * @param string $key
     */
    public function activateConversionByKey($key)
    {
        if (array_key_exists($key, $this->conversions)) {
            if (!($activeConversionKeys = $this->container->get('session')->get(self::CONVERSION_KEY))) {
                $activeConversionKeys = array();
            }
            $activeConversionKeys[] = $key;
            $this->container->get('session')->set(self::CONVERSION_KEY, $activeConversionKeys);
        }
    }

    /**
     * @return Conversion $conversion
     */
    public function getActiveConversions()
    {
        if ($this->hasActiveConversions()) {
            $this->activeConversions = array();
            $activeConversionKeys = $this->container->get('session')->get(self::CONVERSION_KEY);
            $this->container->get('session')->remove(self::CONVERSION_KEY);
            foreach ($activeConversionKeys as $key) {
                $config = $this->conversions[$key];
                $this->activeConversions[] = new Conversion($config['id'], $config['label'], $config['value']);
            }
        }
        return $this->activeConversions;
    }

    /**
     * @return boolean
     */
    public function hasActiveConversions()
    {
        return $this->container->get('session')->has(self::CONVERSION_KEY);
    }
}

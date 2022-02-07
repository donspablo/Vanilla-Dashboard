<?php

namespace CoreDB;

use Closure;
use CoreDB\Classes\ioHelper;
use Exception;
use ReflectionFunction;


class cache
{

    const DEFAULT_CACHE_DIR = "cache/";
    const NO_LIFETIME_FILE_STRING = "no_lifetime";


    protected $lifetime;

    protected $cachePath = "";

    protected $cacheDir = "";

    protected $tokenArray;


    public function __construct(string $storePath, array &$cacheTokenArray, $cacheLifetime)
    {


        $this->setCachePath($storePath);

        $this->setTokenArray($cacheTokenArray);

        $this->lifetime = $cacheLifetime;
    }

    private function setCachePath(string $storePath): cache
    {
        $cachePath = "";
        $cacheDir = $this->getCacheDir();

        if (!empty($storePath)) {
            ioHelper::normalizeDirectory($storePath);
            $cachePath = $storePath . $cacheDir;
        }

        $this->cachePath = $cachePath;

        return $this;
    }

    private function getCacheDir(): string
    {
        return (!empty($this->cacheDir)) ? $this->cacheDir : self::DEFAULT_CACHE_DIR;
    }

    private function setTokenArray(array &$tokenArray): cache
    {
        $this->tokenArray = &$tokenArray;
        return $this;
    }

    public function deleteAll(): bool
    {
        return ioHelper::deleteFiles(glob($this->getCachePath() . "*"));
    }

    public function getCachePath(): string
    {
        return $this->cachePath;
    }

    public function deleteAllWithNoLifetime(): bool
    {
        $noLifetimeFileString = self::NO_LIFETIME_FILE_STRING;
        return ioHelper::deleteFiles(glob($this->getCachePath() . "*.$noLifetimeFileString.json"));
    }

    public function set(array $content)
    {
        $lifetime = $this->getLifetime();
        $cachePath = $this->getCachePath();
        $token = $this->getToken();

        $noLifetimeFileString = self::NO_LIFETIME_FILE_STRING;
        $cacheFile = $cachePath . $token . ".$noLifetimeFileString.json";

        if (is_int($lifetime)) {
            $cacheFile = $cachePath . $token . ".$lifetime.json";
        }

        ioHelper::writeContentToFile($cacheFile, json_encode($content));
    }

    public function getLifetime()
    {
        return $this->lifetime;
    }

    public function getToken(): string
    {
        $tokenArray = $this->getTokenArray();
        $tokenArray = self::convertClosuresToString($tokenArray);

        return md5(json_encode($tokenArray));
    }

    private function getTokenArray(): array
    {
        return $this->tokenArray;
    }

    private static function convertClosuresToString($data)
    {
        if (!is_array($data)) {
            if ($data instanceof \Closure) {
                return self::getClosureAsString($data);
            }
            return $data;
        }
        foreach ($data as $key => $token) {
            if (is_array($token)) {
                $data[$key] = self::convertClosuresToString($token);
            } else if ($token instanceof \Closure) {
                $data[$key] = self::getClosureAsString($token);
            }
        }
        return $data;
    }

    private static function getClosureAsString(Closure $closure)
    {
        try {
            $reflectionFunction = new ReflectionFunction($closure);
        } catch (Exception $exception) {
            return false;
        }
        $filePath = $reflectionFunction->getFileName();
        $startLine = $reflectionFunction->getStartLine();
        $endLine = $reflectionFunction->getEndLine();
        $lineSeparator = PHP_EOL;

        $staticVariables = $reflectionFunction->getStaticVariables();
        $staticVariables = var_export($staticVariables, true);

        if ($filePath === false || $startLine === false || $endLine === false) {
            return false;
        }

        $startEndDifference = $endLine - $startLine;

        $startLine--;

        if ($startLine < 0 || $startEndDifference < 0) {
            return false;
        }


        $fp = fopen($filePath, 'rb');
        $fileContent = "";
        if (flock($fp, LOCK_SH)) {
            $fileContent = @stream_get_contents($fp);
        }
        flock($fp, LOCK_UN);
        fclose($fp);

        if (empty($fileContent)) {
            return false;
        }


        $fileContentArray = explode($lineSeparator, $fileContent);
        if (count($fileContentArray) < $endLine) {
            return false;
        }


        $functionString = implode("", array_slice($fileContentArray, $startLine, $startEndDifference + 1));
        $functionString .= "|staticScopeVariables:" . $staticVariables;
        return $functionString;
    }

    public function get()
    {
        $cachePath = $this->getCachePath();
        $token = $this->getToken();

        $cacheFile = null;

        ioHelper::checkRead($cachePath);

        $cacheFiles = glob($cachePath . $token . "*.json");

        if ($cacheFiles !== false && count($cacheFiles) > 0) {
            $cacheFile = $cacheFiles[0];
        }

        if (!empty($cacheFile)) {
            $cacheParts = explode(".", $cacheFile);
            if (count($cacheParts) >= 3) {
                $lifetime = $cacheParts[count($cacheParts) - 2];
                if (is_numeric($lifetime)) {
                    if ($lifetime === "0") {
                        return json_decode(ioHelper::getFileContent($cacheFile), true);
                    }
                    $fileExpiredAfter = filemtime($cacheFile) + (int)$lifetime;
                    if (time() <= $fileExpiredAfter) {
                        return json_decode(ioHelper::getFileContent($cacheFile), true);
                    }
                    ioHelper::deleteFile($cacheFile);
                } else if ($lifetime === self::NO_LIFETIME_FILE_STRING) {
                    return json_decode(ioHelper::getFileContent($cacheFile), true);
                }
            }
        }
        return null;
    }

    public function delete(): bool
    {
        return ioHelper::deleteFiles(glob($this->getCachePath() . $this->getToken() . "*.json"));
    }

    private function setCacheDir(string $cacheDir): cache
    {
        ioHelper::normalizeDirectory($cacheDir);
        $this->cacheDir = $cacheDir;
        return $this;
    }
}
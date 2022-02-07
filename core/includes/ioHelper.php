<?php

namespace CoreDB\Classes;

use Closure;
use CoreDB\Exceptions\iOException;
use CoreDB\Exceptions\jsonException;
use Exception;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;


class ioHelper
{


    public static function getFileContent(string $filePath): string
    {

        self::checkRead($filePath);

        if (!file_exists($filePath)) {
            throw new iOException("File does not exist: $filePath");
        }

        $content = false;
        $fp = fopen($filePath, 'rb');
        if (flock($fp, LOCK_SH)) {
            $content = stream_get_contents($fp);
        }
        flock($fp, LOCK_UN);
        fclose($fp);

        if ($content === false) {
            throw new iOException("Could not retrieve the content of a file. Please check permissions at: $filePath");
        }

        return $content;
    }

    public static function checkRead(string $path)
    {

        if (!is_readable($path)) {
            throw new iOException(
                "Directory or file is not readable at \"$path\". Please change permission."
            );
        }
    }

    public static function writeContentToFile(string $filePath, string $content)
    {

        self::checkWrite($filePath);


        if (file_put_contents($filePath, $content, LOCK_EX) === false) {
            throw new iOException("Could not write content to file. Please check permissions at: $filePath");
        }
    }

    public static function checkWrite(string $path)
    {
        if (file_exists($path) === false) {
            $path = dirname($path);
        }

        if (!is_writable($path)) {
            throw new iOException(
                "Directory or file is not writable at \"$path\". Please change permission."
            );
        }
    }

    public static function deleteFolder(string $folderPath): bool
    {
        self::checkWrite($folderPath);
        $it = new RecursiveDirectoryIterator($folderPath, RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($files as $file) {
            self::checkWrite($file);
            if ($file->isDir()) {
                rmdir($file->getRealPath());
            } else {
                unlink($file->getRealPath());
            }
        }
        return rmdir($folderPath);
    }


    public static function createFolder(string $folderPath)
    {

        if (file_exists($folderPath) === true) {
            return;
        }
        self::checkWrite($folderPath);

        if (!file_exists($folderPath) && !mkdir($folderPath, 0777, true) && !is_dir($folderPath)) {
            throw new iOException(
                'Unable to create the a directory at ' . $folderPath
            );
        }
    }


    public static function updateFileContent(string $filePath, Closure $updateContentFunction): string
    {
        self::checkRead($filePath);
        self::checkWrite($filePath);

        $content = false;

        $fp = fopen($filePath, 'rb');
        if (flock($fp, LOCK_SH)) {
            $content = stream_get_contents($fp);
        }
        flock($fp, LOCK_UN);
        fclose($fp);

        if ($content === false) {
            throw new iOException("Could not get shared lock for file: $filePath");
        }

        $content = $updateContentFunction($content);

        if (!is_string($content)) {
            $encodedContent = json_encode($content);
            if ($encodedContent === false) {
                $content = (!is_object($content) && !is_array($content) && !is_null($content)) ? $content : gettype($content);
                throw new jsonException("Could not encode content with json_encode. Content: \"$content\".");
            }
            $content = $encodedContent;
        }


        if (file_put_contents($filePath, $content, LOCK_EX) === false) {
            throw new iOException("Could not write content to file. Please check permissions at: $filePath");
        }


        return $content;
    }


    public static function deleteFile(string $filePath): bool
    {

        if (false === file_exists($filePath)) {
            return true;
        }
        try {
            self::checkWrite($filePath);
        } catch (Exception $exception) {
            return false;
        }

        return (@unlink($filePath) && !file_exists($filePath));
    }


    public static function deleteFiles(array $filePaths): bool
    {
        foreach ($filePaths as $filePath) {

            if (true === file_exists($filePath)) {
                try {
                    self::checkWrite($filePath);
                    if (false === @unlink($filePath) || file_exists($filePath)) {
                        return false;
                    }
                } catch (Exception $exception) {

                    return false;
                }
            }
        }
        return true;
    }


    public static function secureStringForFileAccess(string $string): string
    {
        return (str_replace(array(".", "/", "\\"), "", $string));
    }


    public static function normalizeDirectory(string &$directory)
    {
        if (!empty($directory) && substr($directory, -1) !== "/") {
            $directory .= "/";
        }
    }


    public static function countFolderContent(string $folder): int
    {
        self::checkRead($folder);
        $fi = new \FilesystemIterator($folder, \FilesystemIterator::SKIP_DOTS);
        return iterator_count($fi);
    }
}